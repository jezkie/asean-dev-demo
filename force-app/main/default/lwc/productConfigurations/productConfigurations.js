import { LightningElement, api, wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getConfigurations from '@salesforce/apex/ProductDataService.getConfigurations';

export default class ProductConfigurations extends LightningElement {

    @api productId = '';
    configs = [];
    wiredConfs;

    @wire(getConfigurations, {productId: '$productId'})
    wiredConfigurations(result) {
        this.wiredConfs = result;
        if (result.data) {
            console.log(result.data);
            this.configs = result.data;
        }
    }

    @api
    reset() {
        this.configs = null;
    }

    handleConfUpdate(event) {
        return refreshApex(this.wiredConfs);
    }
}