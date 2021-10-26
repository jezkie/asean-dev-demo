import { LightningElement, api, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getConfigurations from '@salesforce/apex/ProductDataService.getConfigurations';

export default class ProductConfigurations extends LightningElement {

    @api productId = '';
    @api opptyId;
    configs;
    @track wiredConfs;

    @wire(getConfigurations, { productId: '$productId' })
    wiredConfigurations(result) {
        this.wiredConfs = result;
        if (result.data) {
            this.configs = result.data;
            console.table(this.configs);
        }
    }

    @api
    reset() {
        this.configs = null;
    }

    // eslint-disable-next-line no-unused-vars
    handleConfUpdate(event) {
        return refreshApex(this.wiredConfs);
    }

    handleLoading(event) {
        this.dispatchEvent(new CustomEvent('loading', {detail: event.detail}));
    }

    get showConfigs() {
        return this.configs && this.configs !== undefined && this.configs.length > 0;
    }
}