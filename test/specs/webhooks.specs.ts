import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import {
    ResponseWebHook,
    WebHookCreateParams,
    WebHooks,
    WebHookTrigger,
    WebHookUpdateParams,
} from "../../src/resources/WebHooks.js";
import { createRequestError } from "../fixtures/errors.js";
import { generateList } from "../fixtures/list.js";
import { generateFixture as generateWebHook } from "../fixtures/webhook.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Web Hooks", () => {
    let api: RestAPI;
    let webHooks: WebHooks;

    const recordBasePathMatcher = pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/webhooks`);
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/webhooks/:id`);
    const recordData = generateWebHook();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        webHooks = new WebHooks(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST [/stores/:storeId]/webhooks", () => {
        it("should get response", async () => {
            fetchMock.post(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: WebHookCreateParams = {
                triggers: [WebHookTrigger.CHARGE_FINISHED],
                url: "http://fake.com",
            };

            const asserts = [webHooks.create(data), webHooks.create(data, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(recordData);
            }
        });

        it("should get response with auth token", async () => {
            fetchMock.post(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: WebHookCreateParams = {
                triggers: [WebHookTrigger.CHARGE_FINISHED],
                url: "http://fake.com",
                authToken: "Bearer mytoken",
            };

            const asserts = [webHooks.create(data), webHooks.create(data, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(recordData);
            }
        });

        it("should return validation error if data is invalid", async () => {
            const asserts: [Partial<WebHookCreateParams>, RequestError][] = [
                [{}, createRequestError(["triggers"])],
                [{ triggers: [WebHookTrigger.CHARGE_FINISHED] }, createRequestError(["url"])],
            ];

            for (const [data, error] of asserts) {
                await expect(webHooks.create(data as WebHookCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET [/stores/:storeId]/webhooks", () => {
        it("should get response", async () => {
            const listData = generateList({
                count: 10,
                recordGenerator: generateWebHook,
            });

            fetchMock.get(recordBasePathMatcher, {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            const asserts = [webHooks.list(), webHooks.list(undefined, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(listData);
            }
        });
    });

    context("GET [/stores/:storeId]/webhooks/:id", () => {
        it("should get response", async () => {
            fetchMock.get(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const asserts = [webHooks.get(uuid()), webHooks.get(uuid(), undefined, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(recordData);
            }
        });
    });

    context("PATCH [/stores/:storeId]/webhooks/:id", () => {
        it("should get response", async () => {
            fetchMock.patch(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: WebHookUpdateParams = {
                triggers: [WebHookTrigger.CHARGE_FINISHED],
                url: "http://fake.com",
            };

            const asserts = [webHooks.update(uuid(), data), webHooks.update(uuid(), data, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.become(recordData);
            }
        });
    });

    context("DELETE [/stores/:storeId]/webhooks/:id", () => {
        it("should get response", async () => {
            fetchMock.delete(recordPathMatcher, {
                status: 204,
                headers: { "Content-Type": "application/json" },
            });

            const asserts = [webHooks.delete(uuid()), webHooks.delete(uuid(), undefined, undefined, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.be.empty;
            }
        });
    });

    it("should return request error when parameters for route are invalid", async () => {
        const errorId = createRequestError(["id"]);

        const asserts: [Promise<ResponseWebHook<WebHookTrigger>> | Promise<void>, RequestError][] = [
            [webHooks.get(null), errorId],
            [webHooks.update(null), errorId],
            [webHooks.delete(null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property("errorResponse")
                .which.eql(error.errorResponse);
        }
    });
});
