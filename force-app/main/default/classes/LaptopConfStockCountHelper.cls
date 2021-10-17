public class LaptopConfStockCountHelper {
    public static void updateStockCount(Set<Id> configIds) {

        List<LaptopConfiguration__c> configs = [SELECT Id, (SELECT Id FROM ProductItems__r WHERE Status__c = 'Available') FROM LaptopConfiguration__c WHERE Id IN :configIds]; 
        for (LaptopConfiguration__c conf : configs) {
            conf.StockCount__c = conf.ProductItems__r.size();
        }

        update configs;
    }
}
