import { LightningElement } from 'lwc';

export default class ProductFilter extends LightningElement {
    brand = '';
    cpu = '';
    ram = '';
    storage = '';

    get brands() {
        return [
            { label: 'All', value: '' },
            { label: 'Lenovo', value: 'Lenovo' },
            { label: 'Hewlett-Packard', value: 'HP' },
            { label: 'Dell', value: 'Dell' },
        ];
    }

    get cpus() {
        return [
            { label: 'i5', value: 'i5' },
            { label: 'i7', value: 'i7' },
            { label: 'i9', value: 'i9' }
        ];
    }

    get rams() {
        return [
            { label: '4 gig', value: '4' },
            { label: '8 gig', value: '8' },
            { label: '16 gig', value: '16' }
        ]
    }

    get storages() {
        return [
            { label: 'HDD', value: 'HDD' },
            { label: 'SSD', value: 'SSD' }
        ]
    }

    handleChange(event) {
        this[event.target.name] = event.detail.value;
    }

    handleSearch(event) {
        this.dispatchEvent(new CustomEvent('search', {
            detail: {
                brand: this.brand || '',
                cpu: this.cpu,
                ram: this.ram,
                storage: this.storage
            }
        }));
    }
}