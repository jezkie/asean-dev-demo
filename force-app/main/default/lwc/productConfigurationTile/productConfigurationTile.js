import { LightningElement, api,track } from 'lwc';
import getAllocations from '@salesforce/apex/ProductDataService.getAllocations';
import updateLocations from '@salesforce/apex/ProductDataService.updateLocations';

function totalStoreCount(__self) {
    let sum = __self.allocatedCount;
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
    @api opptyId;
    // = '0065g000008ykj0AAA';

    @track locationCounts = [];
    
    allocatedCount = 0;
    showEditAllocModal = false;
    storesToUpdate = [];
    isSatisfied = true;
    requiredUnits;
    showEdit = false;
    stockCount = 0;
    isSaveDisabled = true;

    connectedCallback(){
        if (this.conf.ProductItems__r && this.conf.ProductItems__r.length > 0) {
            this.allocatedCount = this.conf.ProductItems__r.filter(item => {
                return item.Opportunity__c && item.Opportunity__c === this.opptyId && item.Status__c === 'Reserved';
            }).length;

            this.stockCount = this.conf.ProductItems__r.filter(item => {
                return item.Status__c === 'Available'
            }).length;

            this.showEdit = this.stockCount > 0;
        }
    }

    // eslint-disable-next-line no-unused-vars
    handleEditAlloc(event) {
        this.showEditAllocModal = true;
        getAllocations({confId: this.conf.Id})
            .then(result => {
                this.locationCounts = Object.entries(result).map((item, idx) => {
                    const [location, count] = item;
                    return {
                        idx: idx,
                        location: location,
                        count: count,
                        total: count + this.allocatedCount
                    }
                });
            })
            .catch(err => console.log(err)); 
    }

    // eslint-disable-next-line no-unused-vars
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

        let total = totalStoreCount(this);
        this.isSaveDisabled = total === 0;
        this.isSatisfied = checkUnitsRequiredSatisfied(this.requiredUnits, total);
    }

    // eslint-disable-next-line no-unused-vars
    handleSave(event) {
        let promises = this.storesToUpdate.map(eachLoc => {
            return updateLocations(
                {
                    opportunityId: this.opptyId,
                    confId: eachLoc.confId, 
                    location: eachLoc.location, 
                    numToUpdate: eachLoc.numToUpdate
                }
            );
        });

        Promise.all(promises)
            .then(res => {
                console.log('Update location results', res);
                this.dispatchEvent(new CustomEvent('confupdate', {}));
            });
        
        this.showEditAllocModal = false;
    }

    handleRequiredUnitsChange(event) {
        this.requiredUnits = event.target.value;
        this.isSatisfied = checkUnitsRequiredSatisfied(this.requiredUnits, totalStoreCount(this));
    }

}