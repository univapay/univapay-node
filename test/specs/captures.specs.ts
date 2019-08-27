import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import uuid from 'uuid';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import { Captures, CaptureCreateParams } from '../../src/resources/Captures';
import { RestAPI } from '../../src/api/RestAPI';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';

describe('Captures', function() {
    let api: RestAPI;
    let captures: Captures;

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        captures = new Captures(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('POST /stores/:storeId/charges/:chargeId/captures', function() {
        it('should get response', async function() {
            fetchMock.postOnce(pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/capture`), {
                status: 201,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: CaptureCreateParams = {
                amount: 1000,
                currency: 'JPY',
            };

            await expect(captures.create(uuid(), uuid(), data)).to.eventually.be.empty;
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<CaptureCreateParams>, RequestError][] = [
                [{}, createRequestError(['amount'])],
                [{ amount: 1000 }, createRequestError(['currency'])],
            ];

            for (const [data, error] of asserts) {
                await expect(captures.create(uuid(), uuid(), data as CaptureCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    it('should return request error when parameters for route are invalid', async function() {
        const errorStoreId = createRequestError(['storeId']);
        const errorChargeId = createRequestError(['chargeId']);

        const asserts: [Promise<any>, RequestError][] = [
            [captures.create(null, null, null), errorStoreId],
            [captures.create(null, uuid(), null), errorStoreId],
            [captures.create(uuid(), null, null), errorChargeId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property('errorResponse')
                .which.eql(error.errorResponse);
        }
    });
});
