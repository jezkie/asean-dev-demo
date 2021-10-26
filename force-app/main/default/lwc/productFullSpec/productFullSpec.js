import { LightningElement, api, wire } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';

import getProductSpecification from '@salesforce/apex/ProductDataService.getProductSpecification';

export default class ProductFullSpec extends NavigationMixin(LightningElement) {

    productSpec;
    @api productId;

    @wire(getProductSpecification, { productId: '$productId' })
    wiredFullSpec({data}){
        if (data) {
            if (data.length > 0) {
                const spec = data[0];

                this.productSpec = {
                    id: spec.Id,
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

    // eslint-disable-next-line no-unused-vars
    handleUpdate(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.productSpec.id,
                objectApiName: 'ProductSpecification__c',
                actionName: 'view'
            },
        });
    }

    // eslint-disable-next-line no-unused-vars
    handleCreate(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'ProductSpecification__c',
                actionName: 'new'
            },
        });
    }
    
}