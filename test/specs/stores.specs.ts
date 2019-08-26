import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import uuid from 'uuid';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import { Stores, StoreCreateParams, StoreUpdateParams } from '../../src/resources/Stores';
import { RestAPI } from '../../src/api/RestAPI';
import { generateList } from '../fixtures/list';
import { generateFixture as generateStore } from '../fixtures/store';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';

describe('Stores', function() {
    let api: RestAPI;
    let stores: Stores;

    const recordBasePathMatcher = pathToRegexMatcher(`${testEndpoint}/stores`);
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:id`);
    const recordData = generateStore();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        stores = new Stores(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('POST /stores', function() {
        it('should get response', async function() {
            fetchMock.postOnce(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: StoreCreateParams = {
                name: 'Store',
            };

            await expect(stores.create(data)).to.eventually.eql(recordData);
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<StoreCreateParams>, RequestError][] = [[{}, createRequestError(['name'])]];

            for (const [data, error] of asserts) {
                await expect(stores.create(data as StoreCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    context('GET /stores', function() {
        it('should get response', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateStore,
            });

            fetchMock.getOnce(recordBasePathMatcher, {
                status: 200,
                body: listData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(stores.list()).to.eventually.eql(listData);
        });
    });

    context('GET /stores/:id', function() {
        it('should get response', async function() {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(stores.get(uuid())).to.eventually.eql(recordData);
        });
    });

    context('PATCH /stores/:id', function() {
        it('should get response', async function() {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: StoreUpdateParams = {
                name: 'Store',
            };

            await expect(stores.update(uuid(), data)).to.eventually.eql(recordData);
        });
    });

    context('DELETE /stores/:id', function() {
        it('should get response', async function() {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(stores.delete(uuid())).to.eventually.be.empty;
        });
    });

    it('should return request error when parameters for route are invalid', async function() {
        const errorId = createRequestError(['id']);

        const asserts: [Promise<any>, RequestError][] = [
            [stores.get(null), errorId],
            [stores.update(null), errorId],
            [stores.delete(null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property('errorResponse')
                .which.eql(error.errorResponse);
        }
    });
});
