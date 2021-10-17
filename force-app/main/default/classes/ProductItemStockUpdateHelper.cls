public with sharing class ProductItemStockUpdateHelper {
    public static void updateStockCount(Set<Id> productIds) {
        Map<Id, Product2> productMap = new Map<Id, Product2>([
            SELECT Id, Items_in_stock__c, (SELECT Id FROM ProductItems__r WHERE Status__c = 'Available') 
            FROM Product2 
            WHERE Id IN :productIds
        ]);

        List<Product2> productsToUpdate = new List<Product2>();
        for (Id eachId: productMap.keySet()) {
            Product2 prod = productMap.get(eachId);
            prod.Items_in_stock__c = prod.ProductItems__r.size();
            productsToUpdate.add(prod);
        }

        System.debug(productsToUpdate);

        update productsToUpdate;
    }
}
