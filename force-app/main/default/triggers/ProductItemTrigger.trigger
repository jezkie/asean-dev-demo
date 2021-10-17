trigger ProductItemTrigger on ProductItem__c (before insert, after insert, before update, after update, before delete, after delete, after undelete) {
    ProductItemTriggerHandler.execute(Trigger.isAfter, Trigger.isInsert, Trigger.isUpdate, Trigger.isDelete, Trigger.isUndelete, Trigger.new, Trigger.old);
}