import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { ECForms } from "../../src/resources/ECForms";
import { generateFixture as generateCheckoutInfo } from "../fixtures/checkout-info";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("EC Forms", () => {
    let api: RestAPI;
    let ecForms: ECForms;

    const recordData = generateCheckoutInfo();
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/merchants/:merchantId/forms/:id`);

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        ecForms = new ECForms(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /merchants/:merchantId/forms/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(ecForms.get(uuid(), uuid())).to.eventually.eql(recordData);
        });
    });
});
