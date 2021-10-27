trigger LaptopConfigurationTrigger on LaptopConfiguration__c (after insert, after update, after delete, after undelete) {

    Set<Id> productIds = new Set<Id>();
    List<LaptopConfiguration__c> confs = Trigger.isDelete ? Trigger.old : Trigger.new;
    for (LaptopConfiguration__c conf : confs) {
        if (Trigger.isUpdate && conf.Price__c != Trigger.oldMap.get(conf.Id).Price__c) {
            productIds.add(conf.ConfigurableProduct__c);
        } else {
            productIds.add(conf.ConfigurableProduct__c);
        }
    }

    List<Product2> products = [SELECT Id, MaxUnitPrice__c, MinUnitPrice__c, (SELECT Price__c FROM LaptopConfigurations__r) FROM Product2 WHERE Id IN :productIds];
    Map<Id, Product2> productsToUpdate = new Map<Id, Product2>();
    for (Product2 eachProd : products) {
        Product2 currentProd = eachProd;
        if (eachProd.LaptopConfigurations__r.size() == 1) {
            currentProd.MaxUnitPrice__c = eachProd.LaptopConfigurations__r[0].Price__c;
            currentProd.MinUnitPrice__c = eachProd.LaptopConfigurations__r[0].Price__c;
            productsToUpdate.put(eachProd.Id, currentProd);
        } else {
            for (LaptopConfiguration__c conf : eachProd.LaptopConfigurations__r) {
                currentProd = productsToUpdate.containsKey(eachProd.Id) ? productsToUpdate.get(eachProd.Id) : eachProd;
                if (conf.Price__c > currentProd.MaxUnitPrice__c) {
                    currentProd.MaxUnitPrice__c = conf.Price__c;
                    productsToUpdate.put(eachProd.Id, currentProd);
                } 
                
                if (conf.Price__c < currentProd.MinUnitPrice__c || currentProd.MinUnitPrice__c == 0) {
                    currentProd.MinUnitPrice__c = conf.Price__c;
                    productsToUpdate.put(eachProd.Id, currentProd);
                }
            }
        }
    }

    update productsToUpdate.values();
    
}