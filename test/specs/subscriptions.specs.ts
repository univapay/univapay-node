import { expect } from "chai";
import fetchMock, { MockMatcher } from "fetch-mock";
import * as sinon from "sinon";
import { SinonSandbox } from "sinon";
import { v4 as uuid } from "uuid";

import { HTTPMethod, RestAPI } from "../../src/api/RestAPI.js";
import { POLLING_INTERVAL } from "../../src/common/constants.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { ChargeStatus, SubscriptionItem } from "../../src/resources/index.js";
import {
    InstallmentPlan,
    SubscriptionCreateParams,
    SubscriptionPeriod,
    Subscriptions,
    SubscriptionSimulationItem,
    SubscriptionSimulationParams,
    SubscriptionStatus,
    SubscriptionUpdateParams,
} from "../../src/resources/Subscriptions.js";
import { PaymentType } from "../../src/resources/TransactionTokens.js";
import { generateFixture as generateCharge } from "../fixtures/charge.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { generateFixture as generateScheduledPayment } from "../fixtures/scheduled-payment.js";
import { generateFixture as generateSubscription } from "../fixtures/subscription.js";
import { testEndpoint } from "../utils/index.js";
import {
    assertPoll,
    assertPollCancel,
    assertPollInternalServerError,
    assertPollInternalServerErrorMaxRetry,
    assertPollNotFoundError,
    assertPollTimeout,
} from "../utils/poll-helper.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Subscriptions", () => {
    let api: RestAPI;
    let subscriptions: Subscriptions;
    let sandbox: SinonSandbox;

    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:id`);
    const recordData = generateSubscription();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        subscriptions = new Subscriptions(api);
        sandbox = sinon.createSandbox({
            properties: ["spy", "clock"],
            useFakeTimers: true,
        });
    });

    afterEach(() => {
        fetchMock.restore();
        sandbox.restore();
    });

    context("POST /subscriptions", () => {
        it("should get response", async () => {
            fetchMock.postOnce(`${testEndpoint}/subscriptions`, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: SubscriptionCreateParams = {
                transactionTokenId: uuid(),
                amount: 1000,
                currency: "JPY",
                period: SubscriptionPeriod.MONTHLY,
            };

            await expect(subscriptions.create(data)).to.become(recordData);
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<SubscriptionCreateParams>, RequestError][] = [
                [{}, createRequestError(["transactionTokenId"])],
                [{ transactionTokenId: uuid() }, createRequestError(["amount"])],
                [{ transactionTokenId: uuid(), amount: 1000 }, createRequestError(["currency"])],
                [{ transactionTokenId: uuid(), amount: 1000, currency: "JPY" }, createRequestError(["period"])],
            ];

            for (const [data, error] of asserts) {
                await expect(subscriptions.create(data as SubscriptionCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET [/stores/:storeId]/subscriptions", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateSubscription,
            });

            fetchMock.get(pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/subscriptions`), {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            const asserts = [subscriptions.list(), subscriptions.list(undefined, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(listData);
            }
        });
    });

    context("GET /stores/:storeId/subscriptions/:id", () => {
        const successItem = { ...recordData, status: SubscriptionStatus.CURRENT };
        const pendingItem = { ...recordData, status: SubscriptionStatus.UNVERIFIED };
        const failingItem = { ...recordData, status: SubscriptionStatus.SUSPENDED };

        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(subscriptions.get(uuid(), uuid())).to.become(recordData);
        });

        it("should perform long polling", async () => {
            const call = () => subscriptions.poll(uuid(), uuid());
            await assertPoll(recordPathMatcher, call, sandbox, successItem, pendingItem);
        });

        it("should timeout polling", async () => {
            const call = () => subscriptions.poll(uuid(), uuid());
            await assertPollTimeout(recordPathMatcher, call, sandbox, pendingItem);
        });

        it("should cancel polling", async () => {
            const cancelCondition = ({ status }) => status === SubscriptionStatus.SUSPENDED;
            const call = () => subscriptions.poll(uuid(), uuid(), undefined, undefined, { cancelCondition });
            await assertPollCancel(recordPathMatcher, call, sandbox, failingItem, pendingItem);
        });

        it("should abort poll on error", async () => {
            const call = () => subscriptions.poll(uuid(), uuid());
            await assertPollNotFoundError(recordPathMatcher, call, sandbox);
        });

        it("should retry poll on internal server error", async () => {
            const call = () => subscriptions.poll(uuid(), uuid());
            await assertPollInternalServerError(recordPathMatcher, call, sandbox, successItem);
        });

        it("should fail poll on internal server error when retry count is exceeded", async () => {
            const call = () => subscriptions.poll(uuid(), uuid());
            await assertPollInternalServerErrorMaxRetry(recordPathMatcher, call, sandbox);
        });
    });

    context("PATCH /stores/:storeId/subscriptions/:id", () => {
        it("should get response", async () => {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: SubscriptionUpdateParams = {
                transactionTokenId: uuid(),
                amount: 1000,
            };

            await expect(subscriptions.update(uuid(), uuid(), data)).to.become(recordData);
        });
    });

    context("DELETE /stores/:storeId/subscriptions/:id", () => {
        it("should get response", async () => {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { "Content-Type": "application/json" },
            });

            await expect(subscriptions.delete(uuid(), uuid())).to.eventually.be.empty;
        });
    });

    context("GET /stores/:storeId/subscriptions/:id/charges", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCharge,
            });

            fetchMock.getOnce(pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:id/charges`), {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(subscriptions.charges(uuid(), uuid())).to.become(listData);
        });
    });

    context("POST [/stores/:storeId]/subscriptions/simulate_plan", () => {
        it("should get response", async () => {
            const simulationData: SubscriptionSimulationItem = {
                installmentPlan: { planType: InstallmentPlan.FIXED_CYCLES, fixedCycles: 3 },
                amount: 10000,
                currency: "JPY",
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
                    headers: { "Content-Type": "application/json" },
                }
            );

            const data: SubscriptionSimulationParams = {
                installmentPlan: { planType: InstallmentPlan.FIXED_CYCLES, fixedCycles: 3 },
                amount: 10000,
                currency: "JPY",
                initialAmount: 1000,
                subsequentCyclesStart: new Date().getTime(),
                paymentType: PaymentType.CARD,
                period: SubscriptionPeriod.MONTHLY,
            };

            const asserts = [subscriptions.simulation(data), subscriptions.simulation(data, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(simulationData);
            }
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<SubscriptionSimulationParams>, RequestError][] = [
                [{}, createRequestError(["installmentPlan"])],
                [{ installmentPlan: null }, createRequestError(["paymentType"])],
                [{ installmentPlan: null, paymentType: PaymentType.CARD }, createRequestError(["currency"])],
                [
                    { installmentPlan: null, paymentType: PaymentType.CARD, currency: "JPY" },
                    createRequestError(["period"]),
                ],
            ];

            for (const [data, error] of asserts) {
                await expect(subscriptions.simulation(data as SubscriptionSimulationParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET /stores/:storeId/subscriptions/:id/payments", () => {
        it("should get the payments list", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateScheduledPayment,
            });

            fetchMock.getOnce(
                pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments`),
                {
                    status: 200,
                    body: listData,
                    headers: { "Content-Type": "application/json" },
                }
            );

            await expect(subscriptions.payments.list(uuid(), uuid())).to.become(listData);
        });
    });

    context("GET /stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId", () => {
        it("should get the payment", async () => {
            const recordData = generateScheduledPayment();

            fetchMock.getOnce(
                pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId`),
                {
                    status: 200,
                    body: recordData,
                    headers: { "Content-Type": "application/json" },
                }
            );

            await expect(subscriptions.payments.get(uuid(), uuid(), uuid())).to.become(recordData);
        });
    });

    context("PATCH /stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId", () => {
        it("should update the payment", async () => {
            const recordData = generateScheduledPayment();

            fetchMock.patchOnce(
                pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId`),
                {
                    status: 200,
                    body: recordData,
                    headers: { "Content-Type": "application/json" },
                }
            );

            await expect(subscriptions.payments.update(uuid(), uuid(), uuid(), recordData)).to.become(recordData);
        });
    });

    context("GET /stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId/charges", () => {
        it("should get the payments list", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCharge,
            });

            fetchMock.getOnce(
                pathToRegexMatcher(
                    `${testEndpoint}/stores/:storeId/subscriptions/:subscriptionId/payments/:paymentId/charges`
                ),
                {
                    status: 200,
                    body: listData,
                    headers: { "Content-Type": "application/json" },
                }
            );

            await expect(subscriptions.payments.listCharges(uuid(), uuid(), uuid())).to.become(listData);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);
        const errorStoreId = createRequestError(["storeId"]);

        const asserts: [Promise<unknown>, RequestError][] = [
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
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });

    context("Poll subscription and first charge", () => {
        const mockGetSuccessOnce = (recordPathMatcher: MockMatcher, body: unknown, name: string) =>
            fetchMock.getOnce(
                recordPathMatcher,
                { status: 200, body, headers: { "Content-Type": "application/json" } },
                { method: HTTPMethod.GET, name }
            );

        const mockSubscriptionPoll = (overrides?: Partial<SubscriptionItem>) => {
            const subscriptionMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:id`);
            const pendingBody = generateSubscription({ status: SubscriptionStatus.UNVERIFIED, ...overrides });
            const successBody = generateSubscription({ status: SubscriptionStatus.CURRENT, ...overrides });

            mockGetSuccessOnce(subscriptionMatcher, pendingBody, "subscription_pending");
            mockGetSuccessOnce(subscriptionMatcher, successBody, "subscription_success");

            return successBody;
        };

        const mockChargesPoll = () => {
            const chargesMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/subscriptions/:id/charges`);
            const pendingBody = { items: [], hasMore: false };
            const successBody = { items: [generateCharge({ status: ChargeStatus.PENDING })], hasMore: false };

            mockGetSuccessOnce(chargesMatcher, pendingBody, "charges_pending");
            mockGetSuccessOnce(chargesMatcher, successBody, "charges_success");

            return successBody;
        };

        const mockChargePoll = () => {
            const chargeMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:id`);
            const pendingBody = generateCharge({ status: ChargeStatus.PENDING });
            const successBody = generateCharge({ status: ChargeStatus.SUCCESSFUL });

            mockGetSuccessOnce(chargeMatcher, pendingBody, "charge_pending");
            mockGetSuccessOnce(chargeMatcher, successBody, "charge_success");

            return successBody;
        };

        it("should poll the subscription and first charge", async () => {
            const expectedSubscription = mockSubscriptionPoll();
            mockChargesPoll();
            const expectedCharge = mockChargePoll();

            const request = subscriptions.pollSubscriptionWithFirstCharge(uuid(), uuid());
            await sandbox.clock.tickAsync(POLLING_INTERVAL * 6);

            await expect(request).to.become({ subscription: expectedSubscription, charge: expectedCharge });
        });

        it("should poll the charge when the charge date is today", async () => {
            const expectedSubscription = mockSubscriptionPoll({
                initialAmount: null,
                scheduleSettings: { startOn: new Date().toISOString(), zoneId: "Asia/Tokyo", preserveEndOfMonth: true },
            });
            mockChargesPoll();
            const expectedCharge = mockChargePoll();

            const request = subscriptions.pollSubscriptionWithFirstCharge(uuid(), uuid());
            await sandbox.clock.tickAsync(POLLING_INTERVAL * 6);

            await expect(request).to.become({
                subscription: expectedSubscription,
                charge: expectedCharge,
            });
        });

        it("should poll the charge when scheduleSettings is not provided", async () => {
            const expectedSubscription = mockSubscriptionPoll({
                initialAmount: null,
                scheduleSettings: null,
            });
            mockChargesPoll();
            const expectedCharge = mockChargePoll();

            const request = subscriptions.pollSubscriptionWithFirstCharge(uuid(), uuid());
            await sandbox.clock.tickAsync(POLLING_INTERVAL * 6);

            await expect(request).to.become({ subscription: expectedSubscription, charge: expectedCharge });
        });

        it("should not poll the charge when the subscription is not immediate", async () => {
            const futureDate = new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
            const expectedSubscription = mockSubscriptionPoll({
                initialAmount: null,
                scheduleSettings: { startOn: futureDate, zoneId: "Asia/Tokyo", preserveEndOfMonth: true },
            });

            const request = subscriptions.pollSubscriptionWithFirstCharge(uuid(), uuid());
            await sandbox.clock.tickAsync(POLLING_INTERVAL * 2);

            await expect(request).to.become({ subscription: expectedSubscription, charge: null });
        });
    });
});
