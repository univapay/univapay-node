import { expect } from "chai";
import fetchMock from "fetch-mock";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { generateList } from "../fixtures/list.js";
import { generateFixture as generateLinkItemFixture } from "../fixtures/links-products.js";
import { testEndpoint } from "../utils/index.js";
import { pathToRegexMatcher } from "../utils/routes.js";

import { LinksProducts } from "../../src/resources/LinksProducts.js";

describe("Links Products", () => {
    let api: RestAPI;
    let linksProducts: LinksProducts;

    const recordBasePathMatcher = pathToRegexMatcher(`${testEndpoint}/checkout/links/:linkId/products`);

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        linksProducts = new LinksProducts(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET (/merchants/:merchantId)(/stores/:storeId)/checkout/links/:linkId/products", () => {
        it("should get response", async () => {
            const listData = generateList({ count: 10, recordGenerator: generateLinkItemFixture });

            fetchMock.get(recordBasePathMatcher, {
                status: 200,
                body: listData,
                headers: { "Content-Type": "application/json" },
            });

            expect(linksProducts.list(uuid())).to.become(listData);
        });
    });
});
