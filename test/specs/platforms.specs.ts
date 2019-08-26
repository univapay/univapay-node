import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { testEndpoint } from '../utils';
import { Platforms } from '../../src/resources/Platforms';
import { RestAPI } from '../../src/api/RestAPI';
import { generateFixture as generatePlatform } from '../fixtures/platforms';

describe('Platforms', function() {
    let api: RestAPI;
    let platforms: Platforms;

    const recordData = generatePlatform();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        platforms = new Platforms(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('GET /platform', function() {
        it('should get response', async function() {
            fetchMock.getOnce(`${testEndpoint}/platform`, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(platforms.getConfiguration()).to.eventually.eql(recordData);
        });
    });
});
