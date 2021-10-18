import { createElement } from 'lwc';
import productCatalog from 'c/productCatalog';

describe('c-product-catalog', () => {
    afterEach(() => {
        while (document.body.firstChild) {
          document.body.removeChild(document.body.firstChild);
        }
        // Prevent data saved on mocks from leaking between tests
        jest.clearAllMocks();
      });

      describe('child component display', () => {
          it('renders three child', () => {
              const element = createElement('c-product-catalog', {
                  is: productCatalog
              })
              document.body.appendChild(element);
              
              console.log(element.shadowRoot.querySelector('c-product-list'));
              expect(element.shadowRoot.querySelector('c-product-list')).not.toBeNull();
              expect(element.shadowRoot.querySelector('c-product-configurations')).not.toBeNull();
              expect(element.shadowRoot.querySelector('c-product-full-spec')).not.toBeNull();
          });
      });
})