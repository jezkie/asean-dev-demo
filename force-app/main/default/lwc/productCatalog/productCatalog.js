import { LightningElement } from 'lwc';

function getActiveTabCompReset(activeTab) {
    return activeTab === 'configuration' ? 'c-product-configurations' : 'c-product-full-spec';
}

export default class ProductCatalog extends LightningElement {

    selectedId = '';

    handleProductSelect(event) {
        this.selectedId = event.detail;
    }

    handleSearch(event) {
        this.selectedId = null;
        this.template.querySelector('c-product-list').loadProducts(event.detail);
        let activeTab = this.template.querySelector('lightning-tabset').activeTabValue;
        this.template.querySelector(getActiveTabCompReset(activeTab)).reset();
    }

    handleActiveTab(event) {
        var activeTab = event.target.value;
        if (!this.selectedId) {
            const comp = this.template.querySelector(getActiveTabCompReset(activeTab));
            if (comp) {
                comp.reset();
            }
        }
    }
}