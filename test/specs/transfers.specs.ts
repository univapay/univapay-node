import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { Transfers } from "../../src/resources/Transfers.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { generateFixture as generateTransfer, generateFixtureTransferStatusChange } from "../fixtures/transfer.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

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

            await expect(transfers.list()).to.become(listData);
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

            await expect(transfers.get(uuid())).to.become(recordData);
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

            await expect(transfers.statusChanges(uuid())).to.become(listData);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);

        const asserts: [Promise<unknown>, RequestError][] = [
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
