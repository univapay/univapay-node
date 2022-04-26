import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { BankAccountCreateParams, BankAccountType, BankAccountUpdateParams } from "../../src/resources/BankAccounts.js";
import { BankAccounts } from "../../src/resources/index.js";
import { generateFixture as generateBankAccount } from "../fixtures/bank-account.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Bank Accounts", () => {
    let api: RestAPI;
    let bankAccounts: BankAccounts;

    const recordBasePathMatcher = `${testEndpoint}/bank_accounts`;
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/bank_accounts/:id`);
    const recordData = generateBankAccount();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        bankAccounts = new BankAccounts(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST /bank_accounts", () => {
        it("should get response", async () => {
            fetchMock.postOnce(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: BankAccountCreateParams = {
                accountNumber: "1234567890",
                country: "JP",
                currency: "JPY",
                holderName: "Joe Doe",
                bankName: "Bank",
                branchName: "Branch",
                bankAddress: "Address",
                swiftCode: "FAKECODE",
                accountType: BankAccountType.CHECKING,
            };

            await expect(bankAccounts.create(data)).to.eventually.eql(recordData);
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<BankAccountCreateParams>, RequestError][] = [
                [{}, createRequestError(["accountNumber"])],
                [{ accountNumber: "" }, createRequestError(["country"])],
                [{ accountNumber: "", country: "JP" }, createRequestError(["currency"])],
                [{ accountNumber: "", country: "JP", currency: "JPY" }, createRequestError(["holderName"])],
                [
                    { accountNumber: "", country: "JP", currency: "JPY", holderName: "Joe" },
                    createRequestError(["bankName"]),
                ],
            ];

            for (const [data, error] of asserts) {
                await expect(bankAccounts.create(data as BankAccountCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET /bank_accounts", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateBankAccount,
            });

            fetchMock.get(recordBasePathMatcher, {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(bankAccounts.list()).to.eventually.eql(listData);
        });
    });

    context("GET /bank_accounts/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(bankAccounts.get(uuid())).to.eventually.eql(recordData);
        });
    });

    context("GET /bank_accounts/primary", () => {
        it("should get response", async () => {
            fetchMock.getOnce(`${recordBasePathMatcher}/primary`, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(bankAccounts.getPrimary()).to.eventually.eql(recordData);
        });
    });

    context("PATCH /bank_accounts/:id", () => {
        it("should get response", async () => {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: BankAccountUpdateParams = {
                accountNumber: "1234567890",
                country: "JP",
                currency: "JPY",
                holderName: "Joe Doe",
                bankName: "Bank",
                branchName: "Branch",
                bankAddress: "Address",
                swiftCode: "FAKECODE",
                accountType: BankAccountType.CHECKING,
            };

            await expect(bankAccounts.update(uuid(), data)).to.eventually.eql(recordData);
        });
    });

    context("DELETE /bank_accounts/:id", () => {
        it("should get response", async () => {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { "Content-Type": "application/json" },
            });

            await expect(bankAccounts.delete(uuid())).to.eventually.be.empty;
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);

        const asserts: [Promise<any>, RequestError][] = [
            [bankAccounts.get(null), errorId],
            [bankAccounts.update(null), errorId],
            [bankAccounts.delete(null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
