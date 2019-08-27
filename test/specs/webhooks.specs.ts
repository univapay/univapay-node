import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import uuid from 'uuid';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import { WebHooks, WebHookTrigger, WebHookCreateParams, WebHookUpdateParams } from '../../src/resources/WebHooks';
import { RestAPI } from '../../src/api/RestAPI';
import { generateList } from '../fixtures/list';
import { generateFixture as generateWebHook } from '../fixtures/webhook';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';

describe('Web Hooks', function() {
    let api: RestAPI;
    let webHooks: WebHooks;

    const recordBasePathMatcher = pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/webhooks`);
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/webhooks/:id`);
    const recordData = generateWebHook();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        webHooks = new WebHooks(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('POST [/stores/:storeId]/webhooks', function() {
        it('should get response', async function() {
            fetchMock.post(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: WebHookCreateParams = {
                triggers: [WebHookTrigger.CHARGE_FINISHED],
                url: 'http://fake.com',
            };

            const asserts = [webHooks.create(data), webHooks.create(data, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(recordData);
            }
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<WebHookCreateParams>, RequestError][] = [
                [{}, createRequestError(['triggers'])],
                [{ triggers: [WebHookTrigger.CHARGE_FINISHED] }, createRequestError(['url'])],
            ];

            for (const [data, error] of asserts) {
                await expect(webHooks.create(data as WebHookCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    context('GET [/stores/:storeId]/webhooks', function() {
        it('should get response', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateWebHook,
            });

            fetchMock.get(recordBasePathMatcher, {
                status: 200,
                body: listData,
                headers: { 'Content-Type': 'application/json' },
            });

            const asserts = [webHooks.list(), webHooks.list(null, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(listData);
            }
        });
    });

    context('GET [/stores/:storeId]/webhooks/:id', function() {
        it('should get response', async function() {
            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const asserts = [webHooks.get(uuid()), webHooks.get(uuid(), null, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(recordData);
            }
        });
    });

    context('PATCH [/stores/:storeId]/webhooks/:id', function() {
        it('should get response', async function() {
            fetchMock.patch(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: WebHookUpdateParams = {
                triggers: [WebHookTrigger.CHARGE_FINISHED],
                url: 'http://fake.com',
            };

            const asserts = [webHooks.update(uuid(), data), webHooks.update(uuid(), data, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(recordData);
            }
        });
    });

    context('DELETE [/stores/:storeId]/webhooks/:id', function() {
        it('should get response', async function() {
            fetchMock.delete(recordPathMatcher, {
                status: 204,
                headers: { 'Content-Type': 'application/json' },
            });

            const asserts = [webHooks.delete(uuid()), webHooks.delete(uuid(), null, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.be.empty;
            }
        });
    });

    it('should return request error when parameters for route are invalid', async function() {
        const errorId = createRequestError(['id']);

        const asserts: [Promise<any>, RequestError][] = [
            [webHooks.get(null), errorId],
            [webHooks.update(null), errorId],
            [webHooks.delete(null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property('errorResponse')
                .which.eql(error.errorResponse);
        }
    });
});
