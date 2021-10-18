import { LightningElement, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class ProductTile extends LightningElement {
    @api product;

    @api selectedProduct;

    // eslint-disable-next-line no-unused-vars
    handleProductClick(event) {
        this.dispatchEvent(new CustomEvent('productselect', {
            detail: this.product.id
        }));
    }

    get tileClass() {
        let tileClass = this.selectedProduct === this.product.id ? TILE_WRAPPER_SELECTED_CLASS : TILE_WRAPPER_UNSELECTED_CLASS;
        return tileClass;
    }

    get backgroundStyle() {
        return `background-image:url(${this.product.DisplayUrl})`;
    }

    get name() {
        return this.product.Name;
    }

    get description() {
        return this.product.Description;
    }

    get minPrice() {
        return this.product.MinUnitPrice__c;
    }

    get maxPrice() {
        return this.product.MaxUnitPrice__c;
    }

    get available() {
        return this.product.available;
    }

    get availableConfig() {
        return this.product.availableCfg;
    }

}