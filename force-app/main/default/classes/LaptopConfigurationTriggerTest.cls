@IsTest
public class LaptopConfigurationTriggerTest {
    @TestSetup
    static void makeData(){
        Product2 laptop = new Product2(
            Brand__c='Lenovo',
            Name='Lenovo Legion 5',
            ProductCode='LAP-LN-001',
            Family='Laptop');
        
        insert laptop;
    }

    @IsTest
    static void testAddSingleConfiguration() {
        Product2 prod = [SELECT Id FROM Product2 LIMIT 1];
        List<LaptopConfiguration__c> laptopCfgs = new List<LaptopConfiguration__c>{
            new LaptopConfiguration__c(Name='Entry Level', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '4', StorageType__c = 'HDD', Price__c = 1200)
        };

        insert laptopCfgs;

        Product2 updatedProd = [SELECT MaxUnitPrice__c, MinUnitPrice__c FROM Product2 LIMIT 1];

        System.assertEquals(1200, updatedProd.MaxUnitPrice__c);
        System.assertEquals(1200, updatedProd.MinUnitPrice__c);
    }

    @IsTest
    static void testTwoNonEqualPrice() {
        Product2 prod = [SELECT Id FROM Product2 LIMIT 1];
        List<LaptopConfiguration__c> laptopCfgs = new List<LaptopConfiguration__c>{
            new LaptopConfiguration__c(Name='Entry Level', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '4', StorageType__c = 'HDD', Price__c = 1200),
            new LaptopConfiguration__c(Name='Intermediate', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '8', StorageType__c = 'HDD', Price__c = 1300)
        };

        insert laptopCfgs;

        Product2 updatedProd = [SELECT MaxUnitPrice__c, MinUnitPrice__c FROM Product2 LIMIT 1];

        System.assertEquals(1300, updatedProd.MaxUnitPrice__c);
        System.assertEquals(1200, updatedProd.MinUnitPrice__c);
    }

    @IsTest
    static void testTwoEqualPrice() {
        Product2 prod = [SELECT Id FROM Product2 LIMIT 1];
        List<LaptopConfiguration__c> laptopCfgs = new List<LaptopConfiguration__c>{
            new LaptopConfiguration__c(Name='Entry Level', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '4', StorageType__c = 'HDD', Price__c = 1200),
            new LaptopConfiguration__c(Name='Intermediate', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '8', StorageType__c = 'HDD', Price__c = 1200)
        };

        insert laptopCfgs;

        Product2 updatedProd = [SELECT MaxUnitPrice__c, MinUnitPrice__c FROM Product2 LIMIT 1];

        System.assertEquals(1200, updatedProd.MaxUnitPrice__c);
        System.assertEquals(1200, updatedProd.MinUnitPrice__c);
    }

    @IsTest
    static void testThreeUnEqualPrice() {
        Product2 prod = [SELECT Id FROM Product2 LIMIT 1];
        List<LaptopConfiguration__c> laptopCfgs = new List<LaptopConfiguration__c>{
            new LaptopConfiguration__c(Name='Entry Level', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '4', StorageType__c = 'HDD', Price__c = 1200),
            new LaptopConfiguration__c(Name='Intermediate', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '8', StorageType__c = 'HDD', Price__c = 1300),
            new LaptopConfiguration__c(Name='Mid-Range', ConfigurableProduct__c=prod.Id, Processor__c='i5', Memory__c = '8', StorageType__c = 'SSD', Price__c = 1400)
        };

        insert laptopCfgs;

        Product2 updatedProd = [SELECT MaxUnitPrice__c, MinUnitPrice__c FROM Product2 LIMIT 1];

        System.assertEquals(1400, updatedProd.MaxUnitPrice__c);
        System.assertEquals(1200, updatedProd.MinUnitPrice__c);
    }
}
