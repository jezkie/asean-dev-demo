@IsTest
public with sharing class ProductItemStockUpdateHelperTest {
    @TestSetup
    static void makeData(){
        Product2 prod = new Product2(
            Name = 'Lenovo Legion 5',
            ProductCode = 'LAP-LN-001',
            IsActive = true
        );

        insert prod;

        List<ProductItem__c> prodItems = new List<ProductItem__c>{
            new ProductItem__c(
                Name = 'Lenovo Legion 5',
                Location__c = 'Warehouse',
                Product__c = prod.Id,
                SerialNo__c = '000001',
                Status__c = 'Available'
            ),
            new ProductItem__c(
                Name = 'Lenovo Legion 5',
                Location__c = 'Warehouse',
                Product__c = prod.Id,
                SerialNo__c = '000002',
                Status__c = 'Unavailable'
            )
        };

        insert prodItems;
    }

    @istest
    static void update_status_test() {
        ProductItem__c prodItem = [SELECT Id, Status__c, Product__c FROM ProductItem__c WHERE Status__c = 'Unavailable'];
        prodItem.Status__c = 'Available';
        update prodItem;

        Product2 prod = [SELECT Id, Items_in_stock__c FROM Product2 WHERE Id = :prodItem.Product__c];
        System.assertEquals(2, prod.Items_in_stock__c);
    }

    @istest
    static void delete_product_item_test() {
        ProductItem__c prodItem = [SELECT Id, Status__c, Product__c FROM ProductItem__c WHERE Status__c = 'Available'];

        delete prodItem;

        Product2 prod = [SELECT Id, Items_in_stock__c FROM Product2 WHERE Id = :prodItem.Product__c];
        System.assertEquals(0, prod.Items_in_stock__c);
    }

    @istest
    static void insert_product_item_test() {
        Product2 prod = [SELECT Id, Items_in_stock__c FROM Product2 LIMIT 1];
        ProductItem__c prodItem = new ProductItem__c(
            Name = 'Lenovo Legion 5',
            Location__c = 'Warehouse',
            Product__c = prod.Id,
            SerialNo__c = '000003',
            Status__c = 'Available'
        );

        insert prodItem;

        Product2 prodPrime = [SELECT Id, Items_in_stock__c FROM Product2 LIMIT 1];

        System.assertEquals(2, prodPrime.Items_in_stock__c);
    }
}
