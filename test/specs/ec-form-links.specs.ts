import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { ECFormLinks } from "../../src/resources/ECFormLinks";
import { generateFixture as generateCheckoutInfo } from "../fixtures/ec-form-link";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("EC Form links", () => {
    let api: RestAPI;
    let ecFormLinks: ECFormLinks;

    const recordData = generateCheckoutInfo();
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/links/:id`);

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        ecFormLinks = new ECFormLinks(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout/links/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(ecFormLinks.get(uuid())).to.eventually.eql(recordData);
        });
    });
});
