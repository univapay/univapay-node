import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { ECForms } from "../../src/resources/ECForms.js";
import { generateFixture as generateCheckoutInfo } from "../fixtures/checkout-info.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("EC Forms", () => {
    let api: RestAPI;
    let ecForms: ECForms;

    const recordData = generateCheckoutInfo();
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/forms/:id`);

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        ecForms = new ECForms(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout/forms/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(ecForms.get(uuid())).to.eventually.eql(recordData);
        });
    });
});
