import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { Emails } from "../../src/resources/Emails";
import { generateFixture as generateCheckoutInfo } from "../fixtures/emails";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("Emails", () => {
    let api: RestAPI;
    let emails: Emails;

    const recordData = generateCheckoutInfo();
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/emails/:id`);

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        emails = new Emails(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout/emails/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(emails.get(uuid())).to.eventually.eql(recordData);
        });
    });
});
