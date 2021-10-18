import { LightningElement, api,track } from 'lwc';
import getAllocations from '@salesforce/apex/ProductDataService.getAllocations';
import updateLocations from '@salesforce/apex/ProductDataService.updateLocations';

function totalStoreCount(__self) {
    let sum = __self.warehouseCount;
    if (__self.storesToUpdate && __self.storesToUpdate.length > 0) {

        let storeCount = __self.storesToUpdate.reduce((total, obj) => {
            return total + obj.numToUpdate;
        }, 0);

        sum = sum + storeCount;
    }

    return sum;
}

function checkUnitsRequiredSatisfied(unitsRequired, total) {
    if (total < unitsRequired) {
        return false;
    } 
    return true;
}

export default class ProductConfigurationTile extends LightningElement {
    @api conf;

    warehouseCount = 0;

    showEditAllocModal = false;

    @track locationCounts = [];

    storesToUpdate = [];

    isSatisfied = true;

    requiredUnits;

    handleEditAlloc(event) {
        this.showEditAllocModal = true;
        getAllocations({confId: this.conf.Id})
            .then(result => {
                console.log(result);
                let arr = Object.entries(result).map((item, idx) => {
                    const [location, count] = item;
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
        const storeToUpdate = {
            confId: this.conf.Id,
            location: event.detail.store,
            numToUpdate: event.detail.numToChange
        }

        let idx;
        idx = this.storesToUpdate.findIndex(s => s.location === storeToUpdate.location);
        if (idx !== -1) {
            let element = this.storesToUpdate.find(s => s.location === storeToUpdate.location);
            element.numToUpdate = storeToUpdate.numToUpdate;
        } else {
            this.storesToUpdate.push(storeToUpdate);
        }

        this.isSatisfied = checkUnitsRequiredSatisfied(this.requiredUnits, totalStoreCount(this));
    }

    handleSave(event) {
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
            .then(res => {
                console.log('Update location results', res);
            });
        
        this.showEditAllocModal = false;

        this.dispatchEvent(new CustomEvent('confupdate', {
            detail: {}
        }));

    }

    handleRequiredUnitsChange(event) {
        this.requiredUnits = event.target.value;
        this.isSatisfied = checkUnitsRequiredSatisfied(this.requiredUnits, totalStoreCount(this));
    }

    get showEdit() {
        if (this.conf.ProductItems__r && this.conf.ProductItems__r.length > 0) {
            const arr = this.conf.ProductItems__r.filter(item => {
                return item.Location__c !== 'Warehouse'
            });

            const warehouseOrReserve = this.conf.ProductItems__r.filter(item => {
                return item.Location__c === 'Warehouse' || (item.Location__c !== 'Warehouse' && item.Status__c === 'Reserved')
            });
            this.warehouseCount = warehouseOrReserve.length;
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