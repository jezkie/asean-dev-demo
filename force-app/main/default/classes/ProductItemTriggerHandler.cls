public with sharing class ProductItemTriggerHandler {
    
    public static void execute(
            Boolean isAfter, 
            Boolean isInsert, 
            Boolean isUpdate, 
            Boolean isDelete,
            Boolean isUndelete,
            List<ProductItem__c> newItems,
            List<ProductItem__c> oldItems) {
        
        if (isInsert) {
            handleInsert(isAfter, newItems);
        } else if (isUpdate) {
            handleUpdate(isAfter, newItems, oldItems);
        } else if (isDelete) {
            handleDelete(isAfter, oldItems);
        } else if (isUndelete) {
            handleUndelete(isAfter, newItems);
        }
        
    }

    static void handleInsert(Boolean isAfter, List<ProductItem__c> newItems) {
        Set<Id> productIds = new Set<Id>();
        if (isAfter) {
            for (ProductItem__c item : newItems) {
                productIds.add(item.Product__c);
            }
            ProductItemStockUpdateHelper.updateStockCount(productIds);
        }
    }

    static void handleUpdate(Boolean isAfter, List<ProductItem__c> newItems, List<ProductItem__c> oldItems) {
        Set<Id> productIds = new Set<Id>();
        Map<Id, ProductItem__c> oldMap = new Map<Id, ProductItem__c>(oldItems);
        if (isAfter) {
            for (ProductItem__c item : newItems) {
                if (item.Status__c != oldMap.get(item.Id).Status__c) {
                    productIds.add(item.Product__c);
                }
            }
            ProductItemStockUpdateHelper.updateStockCount(productIds);
        }
    }

    static void handleDelete(Boolean isAfter, List<ProductItem__c> oldItems) {
        Set<Id> productIds = new Set<Id>();
        if (isAfter) {
            for (ProductItem__c item : oldItems) {
                productIds.add(item.Product__c);
            }
            ProductItemStockUpdateHelper.updateStockCount(productIds);
        }
    }

    static void handleUndelete(Boolean isAfter, List<ProductItem__c> newItems) {
        Set<Id> productIds = new Set<Id>();
        for (ProductItem__c item : newItems) {
            productIds.add(item.Product__c);
        }
    }

}
