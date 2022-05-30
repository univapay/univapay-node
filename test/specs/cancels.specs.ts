import { expect } from "chai";
import fetchMock from "fetch-mock";
import sinon, { SinonSandbox } from "sinon";
import { v4 as uuid } from "uuid";

import { HTTPMethod, RestAPI } from "../../src/api/RestAPI.js";
import { POLLING_INTERVAL, POLLING_TIMEOUT } from "../../src/common/constants.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { TimeoutError } from "../../src/errors/TimeoutError.js";
import { CancelCreateParams, Cancels, CancelStatus } from "../../src/resources/Cancels.js";
import { generateFixture as generateCancel } from "../fixtures/cancel.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Cancels", () => {
    let api: RestAPI;
    let cancels: Cancels;
    let sandbox: SinonSandbox;

    const basePathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/cancels`);
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/cancels/:id`);
    const recordData = generateCancel();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        cancels = new Cancels(api);
        sandbox = sinon.createSandbox({
            properties: ["spy", "clock"],
            useFakeTimers: true,
        });
    });

    afterEach(() => {
        fetchMock.restore();
        sandbox.restore();
    });

    context("POST /stores/:storeId/charges/:chargeId/cancels", () => {
        it("should get response", async () => {
            fetchMock.postOnce(basePathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: CancelCreateParams = {};

            await expect(cancels.create(uuid(), uuid(), data)).to.eventually.eql(recordData);
        });
    });

    context("GET /stores/:storeId/charges/:chargeId/cancels", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCancel,
            });

            fetchMock.get(basePathMatcher, {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(cancels.list(uuid(), uuid())).to.eventually.eql(listData);
        });
    });

    context("GET /stores/:storeId/charges/:chargeId/cancels/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(cancels.get(uuid(), uuid(), uuid())).to.eventually.eql(recordData);
        });

        it("should perform long polling", async () => {
            const recordPendingData = { ...recordData, status: CancelStatus.PENDING };

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

            const request = cancels.poll(uuid(), uuid(), uuid());
            await sandbox.clock.tickAsync(POLLING_INTERVAL);
            await sandbox.clock.tickAsync(POLLING_INTERVAL);

            await expect(request).to.eventually.eql(recordData);
        });

        it("should timeout polling", async () => {
            const recordPendingData = { ...recordData, status: CancelStatus.PENDING };

            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordPendingData,
                headers: { "Content-Type": "application/json" },
            });

            const request = cancels.poll(uuid(), uuid(), uuid());

            await sandbox.clock.tick(POLLING_TIMEOUT);

            await expect(request).to.eventually.be.rejectedWith(TimeoutError);
        });

        it("cancel polling", async () => {
            const recordPendingData = { ...recordData, status: CancelStatus.PENDING };

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
                    body: { ...recordData, status: CancelStatus.FAILED },
                    headers: { "Content-Type": "application/json" },
                },
                {
                    method: HTTPMethod.GET,
                    name: "failed",
                }
            );

            const request = cancels.poll(
                uuid(),
                uuid(),
                uuid(),
                undefined,
                undefined,
                undefined,
                ({ status }) => status === CancelStatus.FAILED
            );
            await sandbox.clock.tickAsync(POLLING_INTERVAL);
            await sandbox.clock.tickAsync(POLLING_INTERVAL);

            await expect(request).to.eventually.eql(null);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);
        const errorStoreId = createRequestError(["storeId"]);
        const errorChargeId = createRequestError(["chargeId"]);

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
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
