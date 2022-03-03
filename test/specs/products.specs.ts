import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { Products } from "../../src/resources/Products";
import { generateFixture as generateCheckoutInfo } from "../fixtures/products";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("Products", () => {
    let api: RestAPI;
    let products: Products;

    const recordData = generateCheckoutInfo();
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/products/:id`);

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        products = new Products(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout/products/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-type": "application/json" },
            });

            await expect(products.get(uuid())).to.eventually.eql(recordData);
        });
    });
});