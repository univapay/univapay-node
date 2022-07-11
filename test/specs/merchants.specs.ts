import { expect } from "chai";
import fetchMock from "fetch-mock";

import { RestAPI } from "../../src/api/RestAPI.js";
import { Merchants } from "../../src/resources/Merchants.js";
import { generateFixture as generateMerchant } from "../fixtures/merchant.js";
import { testEndpoint } from "../utils/index.js";

describe("Merchants", () => {
    let api: RestAPI;
    let merchants: Merchants;

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        merchants = new Merchants(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /me", () => {
        it("should get response", async () => {
            const recordData = generateMerchant();

            fetchMock.getOnce(`${testEndpoint}/me`, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(merchants.me()).to.become(recordData);
        });
    });
});
