import { expect } from "chai";
import fetchMock from "fetch-mock";
import sinon, { SinonSandbox } from "sinon";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { ChargeCreateParams, Charges, ChargeStatus } from "../../src/resources/Charges.js";
import { generateFixture as generateCharge } from "../fixtures/charge.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { testEndpoint } from "../utils/index.js";
import {
    assertPoll,
    assertPollCancel,
    assertPollInternalServerError,
    assertPollNotFoundError,
    assertPollTimeout,
    assertPollInternalServerErrorMaxRetry,
} from "../utils/poll-helper.js";
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

            const asserts = [charges.list(undefined, undefined), charges.list(undefined, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(listData);
            }
        });
    });

    context("GET /stores/:storeId/charges/:id", () => {
        const pendingItem = { ...recordData, status: ChargeStatus.PENDING };
        const successItem = { ...recordData, status: ChargeStatus.SUCCESSFUL };
        const failingItem = { ...recordData, status: ChargeStatus.FAILED };

        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(charges.get(uuid(), uuid())).to.eventually.eql(recordData);
        });

        it("should perform long polling", async () => {
            const call = () => charges.poll(uuid(), uuid());
            await assertPoll(recordPathMatcher, call, sandbox, successItem, pendingItem);
        });

        it("should timeout polling", async () => {
            const call = () => charges.poll(uuid(), uuid());
            await assertPollTimeout(recordPathMatcher, call, sandbox, pendingItem);
        });

        it("should cancel polling", async () => {
            const cancelCondition = ({ status }) => status === ChargeStatus.FAILED;
            const call = () => charges.poll(uuid(), uuid(), undefined, undefined, { cancelCondition });
            await assertPollCancel(recordPathMatcher, call, sandbox, failingItem, pendingItem);
        });

        it("should abort poll on error", async () => {
            const call = () => charges.poll(uuid(), uuid());
            await assertPollNotFoundError(recordPathMatcher, call, sandbox);
        });

        it("should retry poll on internal server error", async () => {
            const call = () => charges.poll(uuid(), uuid());
            await assertPollInternalServerError(recordPathMatcher, call, sandbox, successItem);
        });

        it("should fail poll on internal server error when retry count is exceeded", async () => {
            const call = () => charges.poll(uuid(), uuid());
            await assertPollInternalServerErrorMaxRetry(recordPathMatcher, call, sandbox);
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
