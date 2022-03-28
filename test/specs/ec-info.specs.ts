import { expect } from "chai";
import fetchMock from "fetch-mock";
import { pathToRegexp } from "path-to-regexp";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI";
import { ECInfo } from "../../src/resources";
import { generateFixture as generateCheckoutInfo } from "../fixtures/ec-info";
import { testEndpoint } from "../utils";

describe("EC Info", () => {
    let api: RestAPI;
    let ecInfo: ECInfo;

    const recordData = generateCheckoutInfo();
    const recordPathMatcher = new RegExp(
        `^${testEndpoint}${pathToRegexp("/checkout/info/:id", [], { start: false, end: false }).source}`
    );

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        ecInfo = new ECInfo(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout/info/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(
                {
                    url: recordPathMatcher,
                    query: {
                        secret: "mysecret",
                    },
                },
                {
                    status: 200,
                    body: recordData,
                    headers: { "Content-Type": "application/json" },
                }
            );

            await expect(ecInfo.get(uuid(), { secret: "mysecret" })).to.eventually.eql(recordData);
        });
    });
});
