import { expect } from "chai";
import fetchMock from "fetch-mock";
import sinon, { SinonSandbox } from "sinon";
import { v4 as uuid } from "uuid";

import { HTTPMethod, RestAPI } from "../../src/api/RestAPI.js";
import { POLLING_INTERVAL, POLLING_TIMEOUT } from "../../src/common/constants.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { TimeoutError } from "../../src/errors/TimeoutError.js";
import { ChargeCreateParams, Charges, ChargeStatus } from "../../src/resources/Charges.js";
import { generateFixture as generateCharge } from "../fixtures/charge.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Charges", () => {
    let api: RestAPI;
    let charges: Charges;
    let sandbox: SinonSandbox;

    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:id`);
    const recordData = generateCharge();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        charges = new Charges(api);
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
            fetchMock.postOnce(`${testEndpoint}/charges`, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: ChargeCreateParams = {
                transactionTokenId: uuid(),
                amount: 1000,
                currency: "JPY",
            };

            await expect(charges.create(data)).to.eventually.eql(recordData);
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<ChargeCreateParams>, RequestError][] = [
                [{}, createRequestError(["transactionTokenId"])],
                [{ transactionTokenId: uuid() }, createRequestError(["amount"])],
                [{ transactionTokenId: uuid(), amount: 1000 }, createRequestError(["currency"])],
            ];

            for (const [data, error] of asserts) {
                await expect(charges.create(data as ChargeCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET [/stores/:storeId]/charges", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateCharge,
            });

            fetchMock.get(pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/charges`), {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            const asserts = [charges.list(null, null), charges.list(null, undefined, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(listData);
            }
        });
    });

    context("GET /stores/:storeId/charges/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(charges.get(uuid(), uuid())).to.eventually.eql(recordData);
        });

        it("should perform long polling", async () => {
            const recordPendingData = { ...recordData, status: ChargeStatus.PENDING };

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

            const request = charges.poll(uuid(), uuid());
            await sandbox.clock.tickAsync(POLLING_INTERVAL);
            await sandbox.clock.tickAsync(POLLING_INTERVAL);

            await expect(request).to.eventually.eql(recordData);
        });

        it("should timeout polling", async () => {
            const recordPendingData = { ...recordData, status: ChargeStatus.PENDING };

            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordPendingData,
                headers: { "Content-Type": "application/json" },
            });

            const request = charges.poll(uuid(), uuid());

            sandbox.clock.tick(POLLING_TIMEOUT);

            await expect(request).to.eventually.be.rejectedWith(TimeoutError);
        });

        it("cancel polling", async () => {
            const recordPendingData = { ...recordData, status: ChargeStatus.PENDING };

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
                    body: { ...recordData, status: ChargeStatus.FAILED },
                    headers: { "Content-Type": "application/json" },
                },
                {
                    method: HTTPMethod.GET,
                    name: "failed",
                }
            );

            const request = charges.poll(
                uuid(),
                uuid(),
                undefined,
                undefined,
                undefined,
                ({ status }) => status === ChargeStatus.FAILED
            );
            await sandbox.clock.tickAsync(POLLING_INTERVAL);
            await sandbox.clock.tickAsync(POLLING_INTERVAL);

            await expect(request).to.eventually.eql(null);
        });
    });

    context("GET /stores/:storeId/charges/:chargeId/issuerToken", () => {
        it("should get response", async () => {
            const pathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/issuerToken`);
            const recordIssuerToken = {
                issuerToken: "mytoken",
                callMethod: "http_get",
            };
            fetchMock.getOnce(pathMatcher, {
                status: 200,
                body: recordIssuerToken,
                headers: { "Content-Type": "application/json" },
            });

            await expect(charges.getIssuerToken(uuid(), uuid())).to.eventually.eql(recordIssuerToken);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);
        const errorStoreId = createRequestError(["storeId"]);

        const asserts: [Promise<any>, RequestError][] = [
            [charges.get(null, null), errorStoreId],
            [charges.get(null, uuid()), errorStoreId],
            [charges.get(uuid(), null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
