import { expect } from "chai";
import fetchMock from "fetch-mock";

import { RestAPI } from "../../src/api/RestAPI.js";
import { CheckoutInfo } from "../../src/resources/CheckoutInfo.js";
import { generateFixture as generateCheckoutInfo } from "../fixtures/checkout-info.js";
import { testEndpoint } from "../utils/index.js";

describe("Checkout Info", () => {
    let api: RestAPI;
    let checkoutInfo: CheckoutInfo;

    const recordData = generateCheckoutInfo();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        checkoutInfo = new CheckoutInfo(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout_info", () => {
        it("should get response", async () => {
            fetchMock.getOnce(`begin:${testEndpoint}/checkout_info`, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const origin = "http://fake.com";

            await expect(checkoutInfo.get({ origin })).to.eventually.eql(recordData);
        });
    });
});
