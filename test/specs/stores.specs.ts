import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { StoreCreateParams, StoreItem, Stores, StoreUpdateParams } from "../../src/resources/Stores.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { generateFixture as generateStore } from "../fixtures/store.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Stores", () => {
    let api: RestAPI;
    let stores: Stores;

    const recordBasePathMatcher = pathToRegexMatcher(`${testEndpoint}/stores`);
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:id`);
    const recordData = generateStore();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        stores = new Stores(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST /stores", () => {
        it("should get response", async () => {
            fetchMock.postOnce(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: StoreCreateParams = {
                name: "Store",
            };

            await expect(stores.create(data)).to.eventually.eql(recordData);
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<StoreCreateParams>, RequestError][] = [[{}, createRequestError(["name"])]];

            for (const [data, error] of asserts) {
                await expect(stores.create(data as StoreCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET /stores", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateStore,
            });

            fetchMock.getOnce(recordBasePathMatcher, {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(stores.list()).to.eventually.eql(listData);
        });
    });

    context("GET /stores/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(stores.get(uuid())).to.eventually.eql(recordData);
        });
    });

    context("PATCH /stores/:id", () => {
        it("should get response", async () => {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: StoreUpdateParams = {
                name: "Store",
            };

            await expect(stores.update(uuid(), data)).to.eventually.eql(recordData);
        });
    });

    context("DELETE /stores/:id", () => {
        it("should get response", async () => {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { "Content-Type": "application/json" },
            });

            await expect(stores.delete(uuid())).to.eventually.be.empty;
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);

        const asserts: [Promise<StoreItem> | Promise<void>, RequestError][] = [
            [stores.get(null), errorId],
            [stores.update(null), errorId],
            [stores.delete(null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
