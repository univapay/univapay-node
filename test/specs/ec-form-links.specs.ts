import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { ECFormLinks } from "../../src/resources/ECFormLinks.js";
import { generateFixture as generateCheckoutInfo } from "../fixtures/ec-form-link.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("EC Form links", () => {
    let api: RestAPI;
    let ecFormLinks: ECFormLinks;

    const recordData = generateCheckoutInfo();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        ecFormLinks = new ECFormLinks(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout/links/:id", () => {
        const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/links/:id`);

        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(ecFormLinks.get(uuid())).to.become(recordData);
        });
    });

    context("POST /checkout/links/temporary", () => {
        const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/links/temporary`);

        it("should get response", async () => {
            fetchMock.postOnce(recordPathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(ecFormLinks.createTemporary(uuid(), uuid())).to.become(recordData);
        });
    });
});
