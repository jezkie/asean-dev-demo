import { LightningElement, api, wire, track } from 'lwc';
// eslint-disable-next-line no-unused-vars
import { refreshApex } from '@salesforce/apex';
import getConfigurations from '@salesforce/apex/ProductDataService.getConfigurations';

export default class ProductConfigurations extends LightningElement {

    @api productId = '';
    @api opptyId;
    @track configs;

    @wire(getConfigurations, { productId: '$productId' })
    wiredConfigurations(result) {
        if (result.data) {
            this.configs = result;
            console.table(this.configs.data);
        }
    }

    @api
    reset() {
        this.configs = null;
    }

    // eslint-disable-next-line no-unused-vars
    async handleConfUpdate(event) {
        this.dispatchEvent(new CustomEvent('loading', {detail: true}));
        await refreshApex(this.configs);
        this.dispatchEvent(new CustomEvent('loading', {detail: false}));
    }

    handleLoading(event) {
        this.dispatchEvent(new CustomEvent('loading', {detail: event.detail}));
    }

    get showConfigs() {
        return this.configs && this.configs !== undefined && this.configs.data.length > 0;
    }
}