import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { RequestError } from "../../src/errors/RequestResponseError";
import { Ledgers } from "../../src/resources/Ledgers";
import { createRequestError } from "../fixtures/errors";
import { generateFixture as generateLedger } from "../fixtures/ledger";
import { generateList } from "../fixtures/list";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("Ledgers", () => {
    let api: RestAPI;
    let ledgers: Ledgers;

    const recordData = generateLedger();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        ledgers = new Ledgers(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /transfers/:transferId/ledgers", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateLedger,
            });

            fetchMock.get(pathToRegexMatcher(`${testEndpoint}/transfers/:transferId/ledgers`), {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(ledgers.list(uuid())).to.eventually.eql(listData);
        });
    });

    context("GET /ledgers/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(pathToRegexMatcher(`${testEndpoint}/ledgers/:id`), {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(ledgers.get(uuid())).to.eventually.eql(recordData);
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);
        const errorTransferId = createRequestError(["transferId"]);

        const asserts: [Promise<any>, RequestError][] = [
            [ledgers.list(null), errorTransferId],
            [ledgers.get(null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
