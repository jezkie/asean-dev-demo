public class ProductDataService {

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts(String brand, String processor, String memory, String storageType) {
        List<Product2> products = Database.query(buildQuery(brand, processor, memory, storageType));
        for (Product2 prod : products) {
            System.debug(prod.Name);
            for (ProductItem__c pi : prod.ProductItems__r) {
                System.debug(pi.SerialNo__c);
            }
        }
        return products;
    }

    @TestVisible
    private static String buildQuery(String brand, String processor, String memory, String storageType) {
        String laptopCfgQuery = 'SELECT Id FROM LaptopConfiguration__c';
        String laptopCfgFilter =  String.isBlank(processor) ? '' : 'Processor__c = :processor';
        laptopCfgFilter += String.isBlank(storageType) ? '' : laptopCfgFilter == '' ? 'StorageType__c = :storageType' : ' AND StorageType__c = :storageType';
        laptopCfgFilter += String.isBlank(memory) ? '' : laptopCfgFilter == '' ? 'Memory__c = :memory' : ' AND Memory__c = :memory';

        String productItemsQuery = 'SELECT Id, SerialNo__c FROM ProductItems__r WHERE Status__c = \'Available\' OR Status__c = \'Reserved\'';

        if (String.isNotBlank(laptopCfgFilter)) {
            laptopCfgQuery += ' WHERE ' + laptopCfgFilter;
            productItemsQuery += ' AND LaptopConfiguration__c IN (' + laptopCfgQuery + ')';  
        }


        String query = 'SELECT Id, Name, Description, MaxUnitPrice__c, MinUnitPrice__c, DisplayUrl, (' 
            + productItemsQuery + '), '
            + '(SELECT Id FROM LaptopConfigurations__r) ' 
            + 'FROM Product2 WHERE Family = \'Laptop\''
            + (String.isNotBlank(brand) ? ' AND Brand__c = :brand' : '');

        return query;
    }

    @AuraEnabled(cacheable=true)
    public static List<LaptopConfiguration__c> getConfigurations(String productId) {
        return [SELECT Id, Name, Processor__c, Memory__c, StorageType__c, Price__c, StockCount__c,
                    (SELECT Id, Location__c FROM ProductItems__r WHERE Status__c = 'Available')  
                FROM LaptopConfiguration__c 
                WHERE ConfigurableProduct__c = :productId];
    }

    @AuraEnabled(cacheable=true)
    public static List<ProductSpecification__c> getProductSpecification(String productId) {
        return [SELECT Id, Audio__c, Battery__c, Connectivity__c, Dimension__c, Display__c, Graphics_Card__c, Memory__c, 
                Operating_System__c, Others__c, Ports__c, Processor__c, Name, Storage__c, Weight__c
                FROM ProductSpecification__c 
                WHERE Product__c = :productId];
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getAllocations(String confId) {
        Map<String, Integer> locationCount = new Map<String, Integer>();
        AggregateResult[] groupedResults = [SELECT location__c, COUNT(Id) available 
                FROM ProductItem__c 
                WHERE laptopconfiguration__c = :confId 
                AND Status__c = 'Available'
                GROUP BY location__c];
        for (AggregateResult result : groupedResults) {
            locationCount.put(String.valueOf(result.get('location__c')), Integer.valueOf(result.get('available')));
        }

        return locationCount;
    }

    @AuraEnabled(cacheable=false)
    public static Boolean updateLocations(String confId, String location, Integer numToUpdate) {
        List<ProductItem__c> itemsToUpdate = new List<ProductItem__c>();

        try {
            List<LaptopConfiguration__c> confgs = [SELECT Id, (SELECT Id, SerialNo__c FROM ProductItems__r WHERE Location__c = :location AND Status__c = 'Available' LIMIT :numToUpdate) FROM LaptopConfiguration__c WHERE Id = :confId];
            for (LaptopConfiguration__c conf : confgs) {
                for (ProductItem__c p : conf.ProductItems__r) {
                    System.debug(p.SerialNo__c);
                    p.Status__c = 'Reserved'; 
                    itemsToUpdate.add(p);
                }
            }

            update itemsToUpdate;
            System.debug(confgs);
        } catch (Exception e) {
            return false;
        } 

        return true;
    }

}
