import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import sinon, { SinonSandbox } from 'sinon';
import uuid from 'uuid';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import { ChargeCreateParams, ChargeStatus, Charges } from '../../src/resources/Charges';
import { HTTPMethod, RestAPI } from '../../src/api/RestAPI';
import { generateList } from '../fixtures/list';
import { generateFixture as generateCharge } from '../fixtures/charge';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';
import { POLLING_TIMEOUT } from '../../src/common/constants';
import { TimeoutError } from '../../src/errors/TimeoutError';

describe('Charges', function() {
    let api: RestAPI;
    let charges: Charges;
    let sandbox: SinonSandbox;

    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:id`);
    const recordData = generateCharge();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        charges = new Charges(api);
        sandbox = sinon.createSandbox({
            properties: ['spy', 'clock'],
            useFakeTimers: true,
        });
    });

    afterEach(function() {
        fetchMock.restore();
        sandbox.restore();
    });

    context('POST /subscriptions', function() {
        it('should get response', async function() {
            fetchMock.postOnce(`${testEndpoint}/charges`, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: ChargeCreateParams = {
                transactionTokenId: uuid(),
                amount: 1000,
                currency: 'JPY',
            };

            await expect(charges.create(data)).to.eventually.eql(recordData);
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<ChargeCreateParams>, RequestError][] = [
                [{}, createRequestError(['transactionTokenId'])],
                [{ transactionTokenId: uuid() }, createRequestError(['amount'])],
                [{ transactionTokenId: uuid(), amount: 1000 }, createRequestError(['currency'])],
            ];

            for (const [data, error] of asserts) {
                await expect(charges.create(data as ChargeCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    context('GET [/stores/:storeId]/charges', function() {
        it('should get response', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCharge,
            });

            fetchMock.get(pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/charges`), {
                status: 200,
                body: listData,
                headers: { 'Content-Type': 'application/json' },
            });

            const asserts = [charges.list(null, null), charges.list(null, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(listData);
            }
        });
    });

    context('GET /stores/:storeId/charges/:id', function() {
        it('should get response', async function() {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(charges.get(uuid(), uuid())).to.eventually.eql(recordData);
        });

        it('should perform long polling', async function() {
            const recordPendingData = { ...recordData, status: ChargeStatus.PENDING };

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

            await expect(charges.poll(uuid(), uuid())).to.eventually.eql(recordData);
        });

        it('should timeout polling', async function() {
            const recordPendingData = { ...recordData, status: ChargeStatus.PENDING };

            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordPendingData,
                headers: { 'Content-Type': 'application/json' },
            });

            const request = charges.poll(uuid(), uuid());

            sandbox.clock.tick(POLLING_TIMEOUT);

            await expect(request).to.eventually.be.rejectedWith(TimeoutError);
        });
    });

    it('should return request error when parameters for route are invalid', async function() {
        const errorId = createRequestError(['id']);
        const errorStoreId = createRequestError(['storeId']);

        const asserts: [Promise<any>, RequestError][] = [
            [charges.get(null, null), errorStoreId],
            [charges.get(null, uuid()), errorStoreId],
            [charges.get(uuid(), null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property('errorResponse')
                .which.eql(error.errorResponse);
        }
    });
});
