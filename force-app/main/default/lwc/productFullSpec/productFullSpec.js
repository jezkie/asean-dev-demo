import { LightningElement, api, wire } from 'lwc';
import getProductSpecification from '@salesforce/apex/ProductDataService.getProductSpecification';

export default class ProductFullSpec extends LightningElement {

    productSpec;
    @api productId;

    @wire(getProductSpecification, { productId: '$productId' })
    wiredFullSpec({data}){
        if (data) {
            if (data.length > 0) {
                const spec = data[0];

                this.productSpec = {
                    processor: spec.Processor__c,
                    operatingSystem: spec.Operating_System__c,
                    display: spec.Display__c,
                    memory: spec.Memory__c,
                    battery: spec.Battery__c,
                    storage: spec.Storage__c,
                    graphics: spec.Graphics_Card__c,
                    audio: spec.Audio__c,
                    dimension: spec.Dimension__c,
                    weight: spec.Weight__c,
                    connectivity: spec.Connectivity,
                    ports: spec.Ports__c,
                    others: spec.Others__c
                };
            } else {
                this.productSpec = null;
            }
        }
    }

    @api
    reset() {
        this.productSpec = null;
    }
    
}