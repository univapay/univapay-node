import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { CustomerManagement } from "../../src/resources/index.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Customer management", () => {
    let api: RestAPI;
    let customerManagement: CustomerManagement;

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        customerManagement = new CustomerManagement(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST (/stores/:storeId)/customers/authenticate", () => {
        const recordData = { jwt: "dummy-jwt" };
        const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/customers/authenticate`);

        it("should get authorize response", async () => {
            fetchMock.postOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(
                customerManagement.authorize(uuid(), { email: "myemail@univapay.com", otp: "test" }),
            ).to.become(recordData);
        });

        it("should get send code response", async () => {
            fetchMock.postOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(customerManagement.sendCode(uuid(), { email: "myemail@univapay.com" })).to.become(recordData);
        });
    });
});
