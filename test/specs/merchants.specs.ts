import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { testEndpoint } from '../utils';
import { Merchants } from '../../src/resources/Merchants';
import { RestAPI } from '../../src/api/RestAPI';
import { generateFixture as generateMerchant } from '../fixtures/merchant';

describe('Merchants', function() {
    let api: RestAPI;
    let merchants: Merchants;

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        merchants = new Merchants(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('GET /me', function() {
        it('should get response', async function() {
            const recordData = generateMerchant();

            fetchMock.getOnce(`${testEndpoint}/me`, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(merchants.me()).to.eventually.eql(recordData);
        });
    });
});
