import { expect } from "chai";
import fetchMock from "fetch-mock";
import sinon, { SinonSandbox } from "sinon";
import { v4 as uuid } from "uuid";

import { HTTPMethod, RestAPI } from "../../src/api/RestAPI";
import { POLLING_TIMEOUT } from "../../src/common/constants";
import { RequestError } from "../../src/errors/RequestResponseError";
import { TimeoutError } from "../../src/errors/TimeoutError";
import { CancelCreateParams, Cancels, CancelStatus } from "../../src/resources/Cancels";
import { generateFixture as generateCancel } from "../fixtures/cancel";
import { createRequestError } from "../fixtures/errors";
import { generateList } from "../fixtures/list";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

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

            await expect(cancels.poll(uuid(), uuid(), uuid())).to.eventually.eql(recordData);
        });

        it("should timeout polling", async () => {
            const recordPendingData = { ...recordData, status: CancelStatus.PENDING };

            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordPendingData,
                headers: { "Content-Type": "application/json" },
            });

            const request = cancels.poll(uuid(), uuid(), uuid());

            sandbox.clock.tick(POLLING_TIMEOUT);

            await expect(request).to.eventually.be.rejectedWith(TimeoutError);
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
