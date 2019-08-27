import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { testEndpoint } from '../utils';
import { CheckoutInfo } from '../../src/resources/CheckoutInfo';
import { RestAPI } from '../../src/api/RestAPI';
import { generateFixture as generateCheckoutInfo } from '../fixtures/checkout-info';

describe('Checkout Info', function() {
    let api: RestAPI;
    let checkoutInfo: CheckoutInfo;

    const recordData = generateCheckoutInfo();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        checkoutInfo = new CheckoutInfo(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('GET /checkout_info', function() {
        it('should get response', async function() {
            fetchMock.getOnce(`begin:${testEndpoint}/checkout_info`, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const origin = 'http://fake.com';

            await expect(checkoutInfo.get({ origin })).to.eventually.eql(recordData);
        });
    });
});
