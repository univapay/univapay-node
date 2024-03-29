import { expect } from "chai";
import fetchMock from "fetch-mock";

import { RestAPI } from "../../src/api/RestAPI.js";
import { ExchangeRates } from "../../src/resources/ExchangeRates.js";
import { generateFixture as generateExchangeRate } from "../fixtures/checkout-info.js";
import { testEndpoint } from "../utils/index.js";

describe("Exchange rates", () => {
    let api: RestAPI;
    let exchangeRates: ExchangeRates;

    const recordData = generateExchangeRate();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        exchangeRates = new ExchangeRates(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST /exchange_rates/calculate", () => {
        it("should get a converted amount", async () => {
            fetchMock.postOnce(`begin:${testEndpoint}/exchange_rates/calculate`, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data = {
                amount: 1000,
                currency: "usd",
                to: "PLATFORM",
            };

            await expect(exchangeRates.calculate(data)).to.become(recordData);
        });
    });
});
