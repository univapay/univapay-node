import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { RequestError } from "../../src/errors/RequestResponseError";
import { CaptureCreateParams, Captures } from "../../src/resources/Captures";
import { createRequestError } from "../fixtures/errors";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("Captures", () => {
    let api: RestAPI;
    let captures: Captures;

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        captures = new Captures(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST /stores/:storeId/charges/:chargeId/captures", () => {
        it("should get response", async () => {
            fetchMock.postOnce(pathToRegexMatcher(`${testEndpoint}/stores/:storeId/charges/:chargeId/capture`), {
                status: 201,
                headers: { "Content-Type": "application/json" },
            });

            const data: CaptureCreateParams = {
                amount: 1000,
                currency: "JPY",
            };

            await expect(captures.create(uuid(), uuid(), data)).to.eventually.be.empty;
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<CaptureCreateParams>, RequestError][] = [
                [{}, createRequestError(["amount"])],
                [{ amount: 1000 }, createRequestError(["currency"])],
            ];

            for (const [data, error] of asserts) {
                await expect(captures.create(uuid(), uuid(), data as CaptureCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorStoreId = createRequestError(["storeId"]);
        const errorChargeId = createRequestError(["chargeId"]);

        const asserts: [Promise<any>, RequestError][] = [
            [captures.create(null, null, null), errorStoreId],
            [captures.create(null, uuid(), null), errorStoreId],
            [captures.create(uuid(), null, null), errorChargeId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
