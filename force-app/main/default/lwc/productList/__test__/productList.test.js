import { createElement } from 'lwc';
import productList from 'c/productList';
import getProducts from '@salesforce/apex/ProductDataService.getProducts';
import { registerApexTestWireAdapter } from '@salesforce/sfdx-lwc-jest';

const mockGetProducts = require('./data/getProducts.json');

const getProductsAdapter = registerApexTestWireAdapter(getProducts);

describe('c-product-list', () => {
    afterEach(() => {
        while (document.body.firstChild) {
          document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
      });

      describe('getProducts', () => {
          it('renders two child', () => {
              const element = createElement('c-product-list', {
                  is: productList
              })
              document.body.appendChild(element);
              
              getProductsAdapter.emit(mockGetProducts);

              return Promise.resolve().then(() => {
                  const tileEle = element.shadowRoot.querySelectorAll('c-product-tile');
                //   console.log(tileEle.length);
                  expect(tileEle.length).toBe(mockGetProducts.length);
              });
          });
      });
})