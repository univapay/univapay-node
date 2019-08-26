import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import sinon, { SinonSandbox } from 'sinon';
import uuid from 'uuid';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import { Cancels, CancelCreateParams, CancelStatus } from '../../src/resources/Cancels';
import { HTTPMethod, RestAPI } from '../../src/api/RestAPI';
import { generateList } from '../fixtures/list';
import { generateFixture as generateCancel } from '../fixtures/cancel';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';
import { POLLING_TIMEOUT } from '../../src/common/constants';
import { TimeoutError } from '../../src/errors/TimeoutError';

describe('Cancels', function() {
    let api: RestAPI;
    let cancels: Cancels;
    let sandbox: SinonSandbox;

    const basePathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/cancels`);
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/cancels/:id`);
    const recordData = generateCancel();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        cancels = new Cancels(api);
        sandbox = sinon.createSandbox({
            properties: ['spy', 'clock'],
            useFakeTimers: true,
        });
    });

    afterEach(function() {
        fetchMock.restore();
        sandbox.restore();
    });

    context('POST /stores/:storeId/charges/:chargeId/cancels', function() {
        it('should get response', async function() {
            fetchMock.postOnce(basePathMatcher, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: CancelCreateParams = {};

            await expect(cancels.create(uuid(), uuid(), data)).to.eventually.eql(recordData);
        });
    });

    context('GET /stores/:storeId/charges/:chargeId/cancels', function() {
        it('should get response', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCancel,
            });

            fetchMock.get(basePathMatcher, {
                status: 200,
                body: listData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(cancels.list(uuid(), uuid())).to.eventually.eql(listData);
        });
    });

    context('GET /stores/:storeId/charges/:chargeId/cancels/:id', function() {
        it('should get response', async function() {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(cancels.get(uuid(), uuid(), uuid())).to.eventually.eql(recordData);
        });

        it('should perform long polling', async function() {
            const recordPendingData = { ...recordData, status: CancelStatus.PENDING };

            fetchMock.getOnce(
                recordPathMatcher,
                {
                    status: 200,
                    body: recordPendingData,
                    headers: { 'Content-Type': 'application/json' },
                },
                {
                    method: HTTPMethod.GET,
                    name: 'pending',
                },
            );

            fetchMock.getOnce(
                recordPathMatcher,
                {
                    status: 200,
                    body: recordData,
                    headers: { 'Content-Type': 'application/json' },
                },
                {
                    method: HTTPMethod.GET,
                    name: 'success',
                },
            );

            await expect(cancels.poll(uuid(), uuid(), uuid())).to.eventually.eql(recordData);
        });

        it('should timeout polling', async function() {
            const recordPendingData = { ...recordData, status: CancelStatus.PENDING };

            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordPendingData,
                headers: { 'Content-Type': 'application/json' },
            });

            const request = cancels.poll(uuid(), uuid(), uuid());

            sandbox.clock.tick(POLLING_TIMEOUT);

            await expect(request).to.eventually.be.rejectedWith(TimeoutError);
        });
    });

    it('should return request error when parameters for route are invalid', async function() {
        const errorId = createRequestError(['id']);
        const errorStoreId = createRequestError(['storeId']);
        const errorChargeId = createRequestError(['chargeId']);

        const asserts: [Promise<any>, RequestError][] = [
            [cancels.create(null, null, null), errorStoreId],
            [cancels.create(null, uuid(), null), errorStoreId],
            [cancels.create(uuid(), null, null), errorChargeId],
            [cancels.list(null, null), errorStoreId],
            [cancels.list(null, uuid()), errorStoreId],
            [cancels.list(uuid(), null), errorChargeId],
            [cancels.get(null, null, null), errorStoreId],
            [cancels.get(null, uuid(), null), errorStoreId],
            [cancels.get(null, null, uuid()), errorStoreId],
            [cancels.get(null, uuid(), uuid()), errorStoreId],
            [cancels.get(uuid(), null, null), errorChargeId],
            [cancels.get(uuid(), null, uuid()), errorChargeId],
            [cancels.get(uuid(), uuid(), null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property('errorResponse')
                .which.eql(error.errorResponse);
        }
    });
});
