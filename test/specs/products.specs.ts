import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { Products } from "../../src/resources/Products.js";
import { generateFixture as generateCheckoutInfo } from "../fixtures/products.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

describe("Products", () => {
    let api: RestAPI;
    let products: Products;

    const recordData = generateCheckoutInfo();
    
    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        products = new Products(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout/products/:id", () => {
        const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/products/:id`);

        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-type": "application/json" },
            });

            await expect(products.get(uuid())).to.become(recordData);
        });
    });

    context("GET /checkout/products/code/:code", () => {
        const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/products/code/:code`);

        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-type": "application/json" },
            });

            await expect(products.getByCode("Dummy code")).to.become(recordData);
        });
    });
});
