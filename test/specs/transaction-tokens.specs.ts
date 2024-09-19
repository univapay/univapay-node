import { expect } from "chai";
import fetchMock from "fetch-mock";
import * as sinon from "sinon";
import { SinonSandbox } from "sinon";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import {
    PaymentType,
    TransactionTokenCardDataItem,
    TransactionTokenCreateParams,
    TransactionTokenRenewParams,
    TransactionTokens,
    TransactionTokenType,
    TransactionTokenUpdateParams,
} from "../../src/resources/TransactionTokens.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { generateFixture as generateTransactionToken } from "../fixtures/transaction-tokens.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Transaction Tokens", () => {
    let api: RestAPI;
    let transactionTokens: TransactionTokens;
    let sandbox: SinonSandbox;

    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/tokens/:id`);
    const recordData = generateTransactionToken();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        transactionTokens = new TransactionTokens(api);
        sandbox = sinon.createSandbox({
            properties: ["spy", "clock"],
            useFakeTimers: true,
        });
    });

    afterEach(() => {
        fetchMock.restore();
        sandbox.restore();
    });

    context("POST /tokens", () => {
        it("should get response", async () => {
            fetchMock.postOnce(`${testEndpoint}/tokens`, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: TransactionTokenCreateParams = {
                paymentType: PaymentType.CARD,
                type: TransactionTokenType.ONE_TIME,
                email: "test@fake.com",
                data: {
                    cardholder: "Joe Doe",
                    cardNumber: "4242424242424242",
                    expMonth: "12",
                    expYear: "99",
                    cvv: "123",
                },
            };

            await expect(transactionTokens.create(data)).to.become(recordData);
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<TransactionTokenCreateParams>, RequestError][] = [
                [{}, createRequestError(["paymentType"])],
                [{ paymentType: PaymentType.CARD }, createRequestError(["type"])],
                [
                    { paymentType: PaymentType.CARD, type: TransactionTokenType.ONE_TIME, email: "test@fake.com" },
                    createRequestError(["data"]),
                ],
            ];

            for (const [data, error] of asserts) {
                await expect(transactionTokens.create(data as TransactionTokenCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET [/stores/:storeId]/tokens", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateTransactionToken,
            });

            fetchMock.get(pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/tokens`), {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            const asserts = [transactionTokens.list(), transactionTokens.list(null, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(listData);
            }
        });
    });

    context("GET /stores/:storeId/tokens/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(transactionTokens.get(uuid(), uuid())).to.become(recordData);
        });
    });

    context("PATCH /stores/:storeId/tokens/:id", () => {
        it("should get response", async () => {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: TransactionTokenUpdateParams = {
                email: "test@fake.com",
            };

            await expect(transactionTokens.update(uuid(), uuid(), data)).to.become(recordData);
        });
    });

    context("POST /stores/:storeId/tokens/:id/renew", () => {
        it("should get response", async () => {
            const newCardData = { card: { cardholder: "Dummy Card Holder", expMonth: 1, expYear: 2030 } };

            const cardDataItem = recordData.data as TransactionTokenCardDataItem;
            const newRecordData = {
                ...recordData,
                data: {
                    ...cardDataItem,
                    card: { ...cardDataItem.card, ...newCardData },
                },
            };

            const response = { newRecordData, previousId: "dummy-transaction-token-id" };
            fetchMock.postOnce(pathToRegexMatcher(`${testEndpoint}/stores/:storeId/tokens/:id/renew`), {
                status: 200,
                body: response,
                headers: { "Content-Type": "application/json" },
            });

            const data: TransactionTokenRenewParams = {
                data: {
                    cardholder: "Dummy Card Holder",
                    expMonth: 1,
                    expYear: 2030,
                },
            };

            await expect(transactionTokens.renew(uuid(), uuid(), data)).to.become(response);
        });
    });

    context("DELETE /stores/:storeId/tokens/:id", () => {
        it("should get response", async () => {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { "Content-Type": "application/json" },
            });

            await expect(transactionTokens.delete(uuid(), uuid(), null)).to.eventually.be.empty;
        });
    });

    context("POST /stores/:storeId/tokens/:id", () => {
        it("should get response", async () => {
            fetchMock.postOnce(pathToRegexMatcher(`${testEndpoint}/stores/:storeId/tokens/:id/confirm`), {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data = {
                confirmationCode: "1234",
            };

            await expect(transactionTokens.confirm(uuid(), uuid(), data)).to.become(recordData);
        });
    });

    context("GET /stores/:storeId/tokens/:tokenId/three_ds/issuer_token", () => {
        it("should get response", async () => {
            const pathMatcher = pathToRegexMatcher(
                `${testEndpoint}/stores/:storeId/tokens/:tokenId/three_ds/issuer_token`,
            );
            const issuerToken = {
                issuerToken: "http://www.test.com/test",
                callMethod: "http_post",
                payload: { resourceId: uuid() },
                paymentType: "card",
                contentType: "application/json",
            };

            fetchMock.getOnce(pathMatcher, {
                status: 200,
                body: issuerToken,
                headers: { "Content-Type": "application/json" },
            });

            await expect(transactionTokens.threeDsIssuerToken(uuid(), uuid())).to.become(issuerToken);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);
        const errorStoreId = createRequestError(["storeId"]);

        const asserts: [Promise<unknown>, RequestError][] = [
            [transactionTokens.get(null, null), errorStoreId],
            [transactionTokens.get(null, uuid()), errorStoreId],
            [transactionTokens.get(uuid(), null), errorId],
            [transactionTokens.update(null, null), errorStoreId],
            [transactionTokens.update(null, uuid()), errorStoreId],
            [transactionTokens.update(uuid(), null), errorId],
            [transactionTokens.delete(null, null), errorStoreId],
            [transactionTokens.delete(null, uuid()), errorStoreId],
            [transactionTokens.delete(uuid(), null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
