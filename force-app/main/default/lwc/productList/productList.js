import { LightningElement, api, wire } from 'lwc';
import getProducts from '@salesforce/apex/ProductDataService.getProducts'; 

export default class ProductList extends LightningElement {

    selectedProduct;
    brand = '';
    cpu = '';
    ram = '';
    storage = '';
    products = [];

    @wire(getProducts, { brand: '$brand', processor: '$cpu', memory: '$ram', storageType: '$storage' })
    wiredProducts({data, error}) {
        if (error) {
            console.log(error);
        } else if (data) {
            console.table(data);
            this.selectedProduct = '';
            this.products = data.map(item => {
                return {
                    id: item.Id,
                    DisplayUrl: item.DisplayUrl,
                    Name: item.Name,
                    MinUnitPrice__c: item.MinUnitPrice__c,
                    MaxUnitPrice__c: item.MaxUnitPrice__c,
                    available: (item.ProductItems__r) ? item.ProductItems__r.length : 0,
                    availableCfg: (item.LaptopConfigurations__r) ? item.LaptopConfigurations__r.length : 0
                }
            });
        }
    }

    @api
    loadProducts({brand, cpu, ram, storage}) {
        this.brand = brand;
        this.cpu = cpu;
        this.ram = ram;
        this.storage = storage;
        this.selectedProduct = '';
    }

    handleProductSelect(event) {
        this.selectedProduct = event.detail;
        this.dispatchEvent(new CustomEvent('productselect', {
            detail: event.detail
        }));
    }

    get showList() {
        return this.products && this.products !== undefined && this.products.length > 0 ? true : false;
    }
}