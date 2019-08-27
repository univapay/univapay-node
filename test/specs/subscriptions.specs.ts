import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import * as sinon from 'sinon';
import { SinonSandbox } from 'sinon';
import uuid from 'uuid';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import {
    SubscriptionSimulationItem,
    SubscriptionSimulationParams,
    SubscriptionCreateParams,
    SubscriptionPeriod,
    Subscriptions,
    SubscriptionStatus,
    SubscriptionUpdateParams,
} from '../../src/resources/Subscriptions';
import { HTTPMethod, RestAPI } from '../../src/api/RestAPI';
import { generateList } from '../fixtures/list';
import { generateFixture as generateSubscription } from '../fixtures/subscription';
import { generateFixture as generateCharge } from '../fixtures/charge';
import { generateFixture as generateScheduledPayment } from '../fixtures/scheduled-payment';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';
import { POLLING_TIMEOUT } from '../../src/common/constants';
import { TimeoutError } from '../../src/errors/TimeoutError';
import { PaymentType } from '../../src/resources/TransactionTokens';

describe('Subscriptions', function() {
    let api: RestAPI;
    let subscriptions: Subscriptions;
    let sandbox: SinonSandbox;

    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:id`);
    const recordData = generateSubscription();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        subscriptions = new Subscriptions(api);
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
            fetchMock.postOnce(`${testEndpoint}/subscriptions`, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: SubscriptionCreateParams = {
                transactionTokenId: uuid(),
                amount: 1000,
                currency: 'JPY',
                period: SubscriptionPeriod.MONTHLY,
            };

            await expect(subscriptions.create(data)).to.eventually.eql(recordData);
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<SubscriptionCreateParams>, RequestError][] = [
                [{}, createRequestError(['transactionTokenId'])],
                [{ transactionTokenId: uuid() }, createRequestError(['amount'])],
                [{ transactionTokenId: uuid(), amount: 1000 }, createRequestError(['currency'])],
                [{ transactionTokenId: uuid(), amount: 1000, currency: 'JPY' }, createRequestError(['period'])],
            ];

            for (const [data, error] of asserts) {
                await expect(subscriptions.create(data as SubscriptionCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    context('GET [/stores/:storeId]/subscriptions', function() {
        it('should get response', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateSubscription,
            });

            fetchMock.get(pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/subscriptions`), {
                status: 200,
                body: listData,
                headers: { 'Content-Type': 'application/json' },
            });

            const asserts = [subscriptions.list(null, null), subscriptions.list(null, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(listData);
            }
        });
    });

    context('GET /stores/:storeId/subscriptions/:id', function() {
        it('should get response', async function() {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(subscriptions.get(uuid(), uuid())).to.eventually.eql(recordData);
        });

        it('should perform long polling', async function() {
            const recordPendingData = { ...recordData, status: SubscriptionStatus.UNVERIFIED };

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

            await expect(subscriptions.poll(uuid(), uuid())).to.eventually.eql(recordData);
        });

        it('should timeout polling', async function() {
            const recordPendingData = { ...recordData, status: SubscriptionStatus.UNVERIFIED };

            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordPendingData,
                headers: { 'Content-Type': 'application/json' },
            });

            const request = subscriptions.poll(uuid(), uuid());

            sandbox.clock.tick(POLLING_TIMEOUT);

            await expect(request).to.eventually.be.rejectedWith(TimeoutError);
        });
    });

    context('PATCH /stores/:storeId/subscriptions/:id', function() {
        it('should get response', async function() {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: SubscriptionUpdateParams = {
                transactionTokenId: uuid(),
                amount: 1000,
            };

            await expect(subscriptions.update(uuid(), uuid(), data)).to.eventually.eql(recordData);
        });
    });

    context('DELETE /stores/:storeId/subscriptions/:id', function() {
        it('should get response', async function() {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(subscriptions.delete(uuid(), uuid())).to.eventually.be.empty;
        });
    });

    context('GET /stores/:storeId/subscriptions/:id/charges', function() {
        it('should get response', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCharge,
            });

            fetchMock.getOnce(pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:id/charges`), {
                status: 200,
                body: listData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(subscriptions.charges(uuid(), uuid())).to.eventually.eql(listData);
        });
    });

    context('POST [/stores/:storeId]/subscriptions/simulate_plan', function() {
        it('should get response', async function() {
            const simulationData: SubscriptionSimulationItem<any> = {
                installmentPlan: null,
                amount: 10000,
                currency: 'JPY',
                initialAmount: 1000,
                subsequentCyclesStart: new Date().getTime(),
                paymentType: PaymentType.CARD,
                period: SubscriptionPeriod.MONTHLY,
                cycles: [],
            };

            fetchMock.post(
                pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/subscriptions/simulate_plan`),
                {
                    status: 200,
                    body: simulationData,
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            const data: SubscriptionSimulationParams<any> = {
                installmentPlan: null,
                amount: 10000,
                currency: 'JPY',
                initialAmount: 1000,
                subsequentCyclesStart: new Date().getTime(),
                paymentType: PaymentType.CARD,
                period: SubscriptionPeriod.MONTHLY,
            };

            const asserts = [subscriptions.simulation(data), subscriptions.simulation(data, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(simulationData);
            }
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<SubscriptionSimulationParams<any>>, RequestError][] = [
                [{}, createRequestError(['installmentPlan'])],
                [{ installmentPlan: null }, createRequestError(['paymentType'])],
                [{ installmentPlan: null, paymentType: PaymentType.CARD }, createRequestError(['currency'])],
                [
                    { installmentPlan: null, paymentType: PaymentType.CARD, currency: 'JPY' },
                    createRequestError(['period']),
                ],
            ];

            for (const [data, error] of asserts) {
                await expect(subscriptions.simulation(data as SubscriptionSimulationParams<any>))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    context('GET /stores/:storeId/subscriptions/:id/payments', function() {
        it('should get the payments list', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateScheduledPayment,
            });

            fetchMock.getOnce(
                pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments`),
                {
                    status: 200,
                    body: listData,
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            await expect(subscriptions.payments.list(uuid(), uuid())).to.eventually.eql(listData);
        });
    });

    context('GET /stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId', function() {
        it('should get the payment', async function() {
            const recordData = generateScheduledPayment();

            fetchMock.getOnce(
                pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId`),
                {
                    status: 200,
                    body: recordData,
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            await expect(subscriptions.payments.get(uuid(), uuid(), uuid())).to.eventually.eql(recordData);
        });
    });

    context('PATCH /stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId', function() {
        it('should update the payment', async function() {
            const recordData = generateScheduledPayment();

            fetchMock.patchOnce(
                pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId`),
                {
                    status: 200,
                    body: recordData,
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            await expect(subscriptions.payments.update(uuid(), uuid(), uuid(), recordData)).to.eventually.eql(
                recordData,
            );
        });
    });

    context('GET /stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId/charges', function() {
        it('should get the payments list', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCharge,
            });

            fetchMock.getOnce(
                pathToRegexMatcher(
                    `${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId/charges`,
                ),
                {
                    status: 200,
                    body: listData,
                    headers: { 'Content-Type': 'application/json' },
                },
            );

            await expect(subscriptions.payments.listCharges(uuid(), uuid(), uuid())).to.eventually.eql(listData);
        });
    });

    it('should return request error when parameters for route are invalid', async function() {
        const errorId = createRequestError(['id']);
        const errorStoreId = createRequestError(['storeId']);

        const asserts: [Promise<any>, RequestError][] = [
            [subscriptions.get(null, null), errorStoreId],
            [subscriptions.get(null, uuid()), errorStoreId],
            [subscriptions.get(uuid(), null), errorId],
            [subscriptions.update(null, null), errorStoreId],
            [subscriptions.update(null, uuid()), errorStoreId],
            [subscriptions.update(uuid(), null), errorId],
            [subscriptions.delete(null, null), errorStoreId],
            [subscriptions.delete(null, uuid()), errorStoreId],
            [subscriptions.delete(uuid(), null), errorId],
            [subscriptions.charges(null, null), errorStoreId],
            [subscriptions.charges(null, uuid()), errorStoreId],
            [subscriptions.charges(uuid(), null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property('errorResponse')
                .which.eql(error.errorResponse);
        }
    });
});
