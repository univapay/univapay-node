import { expect } from "chai";

import { pathToRegexMatcher } from "../../utils/routes.js";
import { HTTPMethod, RestAPI } from "../../../src/api/RestAPI.js";
import fetchMock from "fetch-mock";
import { testEndpoint } from "../../utils/index.js";
import { Resource } from "../../../src/resources/Resource.js";

describe("Common > Resource", () => {
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/test/:fooPart(foo/[^/]+)?/bar/:bar`);
    class CustomResource extends Resource {
        static routeBase = "/test";

        get(bar?: string, foo?: string): Promise<unknown> {
            return this.defineRoute(HTTPMethod.GET, "/test(/foo/:foo)/bar/:bar")(null, undefined, { foo, bar });
        }

        postObject(bar?: string, foo?: string): Promise<unknown> {
            return this.defineRoute(HTTPMethod.POST, "/test(/foo/:foo)/bar/:bar")({ bar, foo }, undefined, {
                foo,
                bar,
            });
        }

        postArray(bar?: string, foo?: string): Promise<unknown> {
            return this.defineRoute(HTTPMethod.POST, "/test(/foo/:foo)/bar/:bar")([bar, foo], undefined, { foo, bar });
        }

        postBlob(bar?: string, foo?: string): Promise<unknown> {
            return this.defineRoute(HTTPMethod.POST, "/test(/foo/:foo)/bar/:bar")(new Blob(["test"]), undefined, {
                foo,
                bar,
            });
        }
    }

    let api: RestAPI;
    let resource: CustomResource;

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        resource = new CustomResource(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    describe("Path parameter validation", () => {
        const dummyResponse = { status: 200, body: { test: "test" }, headers: { "Content-Type": "application/json" } };

        it("should get response with optional parameter missing", async () => {
            fetchMock.getOnce(recordPathMatcher, dummyResponse);
            await expect(resource.get("bar")).to.become(dummyResponse.body);
        });

        it("should get response with all parameters", async () => {
            fetchMock.getOnce(recordPathMatcher, dummyResponse);
            await expect(resource.get("bar", "foo")).to.become(dummyResponse.body);
        });

        it("should return error response with required parameters missing", async () => {
            fetchMock.getOnce(recordPathMatcher, dummyResponse);

            await expect(resource.get()).to.eventually.be.rejectedWith(
                "Code: VALIDATION_ERROR, HttpCode: undefined, Errors: REQUIRED_VALUE (bar)",
            );
        });
    });

    describe("Data type", () => {
        const dummyResponse = { status: 200, body: { test: "test" }, headers: { "Content-Type": "application/json" } };

        it("should post response with object data", async () => {
            fetchMock.postOnce(recordPathMatcher, dummyResponse);
            await expect(resource.postObject("bar", "foo")).to.become(dummyResponse.body);
        });

        it("should post response with array data", async () => {
            fetchMock.postOnce(recordPathMatcher, dummyResponse);
            await expect(resource.postArray("bar", "foo")).to.become(dummyResponse.body);
        });

        it("should post response with blob data", async function () {
            if (process.version < "v14.18") {
                // Blob was introduced in v14.18, so skip older versions
                this.skip();
            }

            fetchMock.postOnce(recordPathMatcher, dummyResponse);

            await expect(resource.postBlob("bar", "foo")).to.become(dummyResponse.body);
        });
    });
});
