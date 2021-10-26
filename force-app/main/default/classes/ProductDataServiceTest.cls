@IsTest
public class ProductDataServiceTest {

    @TestSetup
    static void makeData(){
        
        Product2 laptop = new Product2(
            Brand__c='Lenovo',
            Name='Lenovo Legion 5',
            ProductCode='LAP-LN-001',
            Family='Laptop');
        
        insert laptop;

        List<LaptopConfiguration__c> laptopCfgs = new List<LaptopConfiguration__c>{
            new LaptopConfiguration__c(Name='Entry Level', ConfigurableProduct__c=laptop.Id, Processor__c='i5', Memory__c = '4', StorageType__c = 'HDD', Price__c = 1200),
            new LaptopConfiguration__c(Name='Intermediate', ConfigurableProduct__c=laptop.Id, Processor__c='i5', Memory__c = '8', StorageType__c = 'HDD', Price__c = 1300),
            new LaptopConfiguration__c(Name='Mid-Range', ConfigurableProduct__c=laptop.Id, Processor__c='i5', Memory__c = '8', StorageType__c = 'SSD', Price__c = 1400),
            new LaptopConfiguration__c(Name='Performance', ConfigurableProduct__c=laptop.Id, Processor__c='i7', Memory__c = '16', StorageType__c = 'SSD', Price__c = 1500),
            new LaptopConfiguration__c(Name='Gaming', ConfigurableProduct__c=laptop.Id, Processor__c='i9', Memory__c = '32', StorageType__c = 'SSD', Price__c = 1600)
        };

        insert laptopCfgs;

        LaptopConfiguration__c entry = [SELECT Id FROM LaptopConfiguration__c WHERE Name = 'Entry Level' LIMIT 1];
        LaptopConfiguration__c inter = [SELECT Id FROM LaptopConfiguration__c WHERE Name = 'Intermediate' LIMIT 1];
        LaptopConfiguration__c mid = [SELECT Id FROM LaptopConfiguration__c WHERE Name = 'Mid-Range' LIMIT 1];
        LaptopConfiguration__c performance = [SELECT Id FROM LaptopConfiguration__c WHERE Name = 'Performance' LIMIT 1];
        LaptopConfiguration__c gaming = [SELECT Id FROM LaptopConfiguration__c WHERE Name = 'Gaming' LIMIT 1];

        List<ProductItem__c> productItems = new List<ProductItem__c>{
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=entry.Id,Location__c='Warehouse', Name='Legion 5', SerialNo__c='0001', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=inter.Id,Location__c='Warehouse', Name='Legion 5', SerialNo__c='0002', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=mid.Id,Location__c='Warehouse', Name='Legion 5', SerialNo__c='0003', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=performance.Id,Location__c='Warehouse', Name='Legion 5', SerialNo__c='0004', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=gaming.Id,Location__c='Warehouse', Name='Legion 5', SerialNo__c='0005', Status__c='Available')
        };

        insert productItems;


        insert new Opportunity(Name='Test', CloseDate=Date.today().addDays(1), StageName='Negotiation/Review');

    }

    @IsTest
    static void testGetProducts() {
        List<Product2> products = ProductDataService.getProducts('Lenovo', Null, Null, Null);
        System.assert(products.size() > 0);
    }
    
    @IsTest
    static void testUpdateLocation() {
        Product2 laptop = [SELECT Id FROM Product2 LIMIT 1];
        LaptopConfiguration__c entry = [SELECT Id FROM LaptopConfiguration__c WHERE Name = 'Entry Level' LIMIT 1];
        List<ProductItem__c> productItems = new List<ProductItem__c>{
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=entry.Id,Location__c='Warehouse', Name='HP Envy', SerialNo__c='HP0001', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=entry.Id,Location__c='Warehouse', Name='HP Envy', SerialNo__c='HP0005', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=entry.Id,Location__c='Store One', Name='HP Envy', SerialNo__c='HP0004', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=entry.Id,Location__c='Store One', Name='HP Envy', SerialNo__c='HP0003', Status__c='Available'),
            new ProductItem__c(Product__c=laptop.Id, LaptopConfiguration__c=entry.Id,Location__c='Store One', Name='HP Envy', SerialNo__c='HP0002', Status__c='Available')
        };

        insert productItems;

        Opportunity oppty = [SELECT Id FROM Opportunity LIMIT 1];

        ProductDataService.updateLocations(oppty.Id, entry.Id, 'Store One', 2);

        List<ProductItem__c> result = [SELECT Id FROM ProductItem__c WHERE Status__c = 'Reserved'];
        System.assertEquals(2, result.size());
    }
}
