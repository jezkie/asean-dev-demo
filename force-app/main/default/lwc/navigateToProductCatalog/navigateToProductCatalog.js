import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

const ROOT_URL = '/one/one.app#';

export default class NavigateToProductCatalog extends NavigationMixin(LightningElement) {

    // eslint-disable-next-line no-unused-vars
    opptyId;

    @api
    get recordId() {
        return this.opptyId;
    }

    set recordId(value) {
        this.setAttribute('opptyId', value);
        this.opptyId = value;
    }

    // @api recordId;

    // eslint-disable-next-line no-unused-vars
    navigate(event) {

        let encodedPageRef = btoa(JSON.stringify({
                componentDef: 'c:productCatalog',
                attributes: {
                    opptyId: this.opptyId
                }
            })
        );

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: `${ROOT_URL}${encodedPageRef}`
            }
        });

    }
}