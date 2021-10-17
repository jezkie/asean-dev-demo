import { LightningElement, api } from 'lwc';

export default class StoreUnitSlider extends LightningElement {

    @api store;
    @api min;
    @api max;
    @api count;
    newValue;

    connectedCallback() {
        this.newValue = this.min;
    }

    handleChange(event) {
        this.newValue = event.target.value;
        this.dispatchEvent(new CustomEvent('slide', {
            detail: {
                numToChange: this.newValue - this.min,
                store: this.store
            }
        }));
    }
}