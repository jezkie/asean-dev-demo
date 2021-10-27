import { LightningElement, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import NAME_FIELD from '@salesforce/schema/Opportunity.Name';
import BRAND_FIELD from '@salesforce/schema/Product2.Brand__c';

export default class ProductFilter extends LightningElement {
    brand = '';
    cpu = '';
    ram = '';
    storage = '';
    brandOptions = [];

    @api opptyId;

    @wire(getRecord, { recordId: '$opptyId', fields: [ NAME_FIELD ] })
    oppty;

    @wire(getPicklistValues, { recordTypeId: '0125g000000uwviAAA', fieldApiName: BRAND_FIELD })
    setBrands({data, error}) {
        if (data && data.values) {
            this.brandOptions = data.values;
        } else if (error) {
            this.brandOptions = [
                { label: 'All', value: '' },
                { label: 'Lenovo', value: 'Lenovo' },
                { label: 'Hewlett-Packard', value: 'HP' },
                { label: 'Dell', value: 'Dell' },
            ];
        }
    }

    handleChange(event) {
        this[event.target.name] = event.detail.value;
        this.dispatchEvent(new CustomEvent('search', {
            detail: {
                brand: this.brand || '',
                cpu: this.cpu,
                ram: this.ram,
                storage: this.storage
            }
        }));
    }

    get title() {
        console.log('Oppty', this.oppty);
        return this.oppty && 
            this.oppty.data && 
            this.oppty.data.fields && 
            this.oppty.data.fields.Name && 
            this.oppty.data.fields.Name.value ? this.oppty.data.fields.Name.value : 'Filter Laptop';
    }

}