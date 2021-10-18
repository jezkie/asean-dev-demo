import { LightningElement, api } from 'lwc';
import getAllocations from '@salesforce/apex/ProductDataService.getAllocations';
import updateLocations from '@salesforce/apex/ProductDataService.updateLocations';

export default class ProductConfigurationTile extends LightningElement {
    @api conf;

    warehouseCount = 0;

    showEditAllocModal = false;

    locationCounts = [];

    storesToUpdate = [];

    handleEditAlloc(event) {
        this.showEditAllocModal = true;
        getAllocations({confId: this.conf.Id})
            .then(result => {
                console.log(result);
                var arr = Object.entries(result).map((item, idx) => {
                    const [location, count] = item;
                    if (location === 'Warehouse') {
                        this.warehouseCount = count;
                    }
                    return {
                        idx: idx,
                        location: location,
                        count: count
                    }
                });
                this.locationCounts = (arr.filter(item => {
                    return item.location !== 'Warehouse'
                })).map(item => {
                    return {
                        idx: item.idx,
                        location: item.location,
                        count: item.count,
                        total: item.count + this.warehouseCount
                    }
                });
                console.log('this.locationCounts', this.locationCounts);
            })
            .catch(err => console.log(err)); 
    }

    handleCancelClick(event) {
        this.showEditAllocModal = false;
    }

    handleSlide(event) {
        console.log(event.detail);
        const storeToUpdate = {
            confId: this.conf.Id,
            location: event.detail.store,
            numToUpdate: event.detail.numToChange
        }

        var idx;
        idx = this.storesToUpdate.findIndex(s => s.location === storeToUpdate.location);
        if (idx !== -1) {
            var element = this.storesToUpdate.find(s => s.location === storeToUpdate.location);
            element.numToUpdate = storeToUpdate.numToUpdate;
        } else {
            this.storesToUpdate.push(storeToUpdate);
        }
    }

    handleSave(event) {
        console.log('this.storesToUpdate', this.storesToUpdate);

        let promises = this.storesToUpdate.map(eachLoc => {
            return updateLocations(
                {
                    confId: eachLoc.confId, 
                    location: eachLoc.location, 
                    numToUpdate: eachLoc.numToUpdate
                }
            );
        });

        Promise.all(promises)
            .then(res => console.log('Update location results', res));
        
        this.showEditAllocModal = false;

        this.dispatchEvent(new CustomEvent('confupdate', {
            detail: {}
        }));

    }

    get showEdit() {
        if (this.conf.ProductItems__r && this.conf.ProductItems__r.length > 0) {
            const arr = this.conf.ProductItems__r.filter(item => {
                return item.Location__c !== 'Warehouse'
            });

            if (arr.length > 0) {
                return true;
            }
        }

        return false;
    }

    get stockCount() {
        return this.conf.ProductItems__r ? this.conf.ProductItems__r.length : 0;
    }

}