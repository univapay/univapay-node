import { expect } from "chai";
import fetchMock from "fetch-mock";
import * as sinon from "sinon";
import { SinonSandbox } from "sinon";
import { v4 as uuid } from "uuid";

import { HTTPMethod, RestAPI } from "../../src/api/RestAPI";
import { POLLING_INTERVAL, POLLING_TIMEOUT } from "../../src/common/constants";
import { RequestError } from "../../src/errors/RequestResponseError";
import { TimeoutError } from "../../src/errors/TimeoutError";
import {
    RefundCreateParams,
    RefundReason,
    Refunds,
    RefundStatus,
    RefundUpdateParams,
} from "../../src/resources/Refunds";
import { createRequestError } from "../fixtures/errors";
import { generateList } from "../fixtures/list";
import { generateFixture as generateRefund } from "../fixtures/refund";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("Refunds", () => {
    let api: RestAPI;
    let refunds: Refunds;
    let sandbox: SinonSandbox;

    const basePathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/refunds`);
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/refunds/:id`);
    const recordData = generateRefund();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        refunds = new Refunds(api);
        sandbox = sinon.createSandbox({
            properties: ["spy", "clock"],
            useFakeTimers: true,
        });
    });

    afterEach(() => {
        fetchMock.restore();
        sandbox.restore();
    });

    context("POST /stores/:storeId/charges/:chargeId/refunds", () => {
        it("should get response", async () => {
            fetchMock.postOnce(basePathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: RefundCreateParams = {
                amount: 1000,
                currency: "JPY",
                reason: RefundReason.CUSTOMER_REQUEST,
                message: "Refund",
                metadata: {},
            };

            await expect(refunds.create(uuid(), uuid(), data)).to.eventually.eql(recordData);
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<RefundCreateParams>, RequestError][] = [
                [{}, createRequestError(["amount"])],
                [{ amount: 1000 }, createRequestError(["currency"])],
            ];

            for (const [data, error] of asserts) {
                await expect(refunds.create(uuid(), uuid(), data as RefundCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET /stores/:storeId/charges/:chargeId/refunds", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateRefund,
            });

            fetchMock.get(basePathMatcher, {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(refunds.list(uuid(), uuid())).to.eventually.eql(listData);
        });
    });

    context("GET /stores/:storeId/charges/:chargeId/refunds/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(refunds.get(uuid(), uuid(), uuid())).to.eventually.eql(recordData);
        });

        it("should perform long polling", async () => {
            const recordPendingData = { ...recordData, status: RefundStatus.PENDING };

            fetchMock.getOnce(
                recordPathMatcher,
                {
                    status: 200,
                    body: recordPendingData,
                    headers: { "Content-Type": "application/json" },
                },
                {
                    method: HTTPMethod.GET,
                    name: "pending",
                }
            );

            fetchMock.getOnce(
                recordPathMatcher,
                {
                    status: 200,
                    body: recordData,
                    headers: { "Content-Type": "application/json" },
                },
                {
                    method: HTTPMethod.GET,
                    name: "success",
                }
            );

            const request = refunds.poll(uuid(), uuid(), uuid());
            await sandbox.clock.tickAsync(POLLING_INTERVAL);
            await sandbox.clock.tickAsync(POLLING_INTERVAL);

            await expect(request).to.eventually.eql(recordData);
        });

        it("should timeout polling", async () => {
            const recordPendingData = { ...recordData, status: RefundStatus.PENDING };

            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordPendingData,
                headers: { "Content-Type": "application/json" },
            });

            const request = refunds.poll(uuid(), uuid(), uuid());

            sandbox.clock.tick(POLLING_TIMEOUT);

            await expect(request).to.eventually.be.rejectedWith(TimeoutError);
        });
    });

    context("PATCH /stores/:storeId/charges/:chargeId/refunds/:id", () => {
        it("should get response", async () => {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: RefundUpdateParams = {
                status: RefundStatus.SUCCESSFUL,
                reason: RefundReason.CUSTOMER_REQUEST,
                message: "Refund",
            };

            await expect(refunds.update(uuid(), uuid(), uuid(), data)).to.eventually.eql(recordData);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);
        const errorStoreId = createRequestError(["storeId"]);
        const errorChargeId = createRequestError(["chargeId"]);

        const asserts: [Promise<any>, RequestError][] = [
            [refunds.create(null, null, null), errorStoreId],
            [refunds.create(null, uuid(), null), errorStoreId],
            [refunds.create(uuid(), null, null), errorChargeId],
            [refunds.list(null, null), errorStoreId],
            [refunds.list(null, uuid()), errorStoreId],
            [refunds.list(uuid(), null), errorChargeId],
            [refunds.get(null, null, null), errorStoreId],
            [refunds.get(null, uuid(), null), errorStoreId],
            [refunds.get(null, null, uuid()), errorStoreId],
            [refunds.get(null, uuid(), uuid()), errorStoreId],
            [refunds.get(uuid(), null, null), errorChargeId],
            [refunds.get(uuid(), null, uuid()), errorChargeId],
            [refunds.get(uuid(), uuid(), null), errorId],

            [refunds.update(null, null, null), errorStoreId],
            [refunds.update(null, uuid(), null), errorStoreId],
            [refunds.update(null, null, uuid()), errorStoreId],
            [refunds.update(null, uuid(), uuid()), errorStoreId],
            [refunds.update(uuid(), null, null), errorChargeId],
            [refunds.update(uuid(), null, uuid()), errorChargeId],
            [refunds.update(uuid(), uuid(), null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
