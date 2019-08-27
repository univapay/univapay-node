import { expect } from 'chai';
import { RestAPI } from '../../src/api/RestAPI';
import fetchMock from 'fetch-mock';
import { testEndpoint } from '../utils';
import { generateFixture as generateExchangeRate } from '../fixtures/checkout-info';
import { ExchangeRates } from '../../src/resources/ExchangeRates';

describe('Exchange rates', function() {
    let api: RestAPI;
    let exchangeRates: ExchangeRates;

    const recordData = generateExchangeRate();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        exchangeRates = new ExchangeRates(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('POST /exchange_rates/calculate', function() {
        it('should get a converted amount', async function() {
            fetchMock.postOnce(`begin:${testEndpoint}/exchange_rates/calculate`, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data = {
                amount: 1000,
                currency: 'usd',
                to: 'PLATFORM',
            };

            await expect(exchangeRates.calculate(data)).to.eventually.eql(recordData);
        });
    });
});
