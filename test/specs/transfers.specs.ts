import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { RequestError } from "../../src/errors/RequestResponseError";
import { Transfers } from "../../src/resources/Transfers";
import { createRequestError } from "../fixtures/errors";
import { generateList } from "../fixtures/list";
import { generateFixture as generateTransfer, generateFixtureTransferStatusChange } from "../fixtures/transfer";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("Transfers", () => {
    let api: RestAPI;
    let transfers: Transfers;

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        transfers = new Transfers(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /transfers", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateTransfer,
            });

            fetchMock.get(`${testEndpoint}/transfers`, {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(transfers.list()).to.eventually.eql(listData);
        });
    });

    context("GET /transfers/:id", () => {
        it("should get response", async () => {
            const recordData = generateTransfer();

            fetchMock.getOnce(pathToRegexMatcher(`${testEndpoint}/transfers/:id`), {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(transfers.get(uuid())).to.eventually.eql(recordData);
        });
    });

    context("GET /transfers/:id/status_changes", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateFixtureTransferStatusChange,
            });

            fetchMock.getOnce(pathToRegexMatcher(`${testEndpoint}/transfers/:id/status_changes`), {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(transfers.statusChanges(uuid())).to.eventually.eql(listData);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);

        const asserts: [Promise<any>, RequestError][] = [
            [transfers.get(null), errorId],
            [transfers.statusChanges(null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
