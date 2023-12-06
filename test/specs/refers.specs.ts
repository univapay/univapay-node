import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { Refers } from "../../src/resources/index.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Refers", () => {
    let api: RestAPI;
    let refers: Refers;

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        refers = new Refers(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST (/stores/:storeId)/authorize/customer_login", () => {
        const recordData = { jwt: "dummy-jwt" };
        const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/authorize/customer_login`);

        it("should get authorize response", async () => {
            fetchMock.postOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(refers.authorize(uuid(), { email: "myemail@univapay.com", otp: "test" })).to.become(
                recordData,
            );
        });

        it("should get send code response", async () => {
            fetchMock.postOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(refers.sendCode(uuid(), { email: "myemail@univapay.com" })).to.become(recordData);
        });
    });
});
