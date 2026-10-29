import { expect } from "chai";
import fetchMock from "fetch-mock";
import { pathToRegexp } from "path-to-regexp";
import { v4 as uuid } from "uuid";

import { RestAPI } from "../../src/api/RestAPI.js";
import { ECInfo } from "../../src/resources/index.js";
import { generateFixture as generateECInfo } from "../fixtures/ec-info.js";
import { testEndpoint } from "../utils/index.js";

describe("EC Info", () => {
    let api: RestAPI;
    let ecInfo: ECInfo;

    const recordData = generateECInfo();
    const recordPathMatcher = new RegExp(
        `^${testEndpoint}${pathToRegexp("/checkout/info/:id", { end: false }).regexp.source.slice(1)}`,
    );

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        ecInfo = new ECInfo(api);
    });

    afterEach(() => {
        fetchMock.removeRoutes().clearHistory();
    });

    context("GET /checkout/info/:id", () => {
        it("should get response", async () => {
            fetchMock.getOnce(
                recordPathMatcher,
                {
                    status: 200,
                    body: recordData,
                    headers: { "Content-Type": "application/json" },
                },
                {
                    query: {
                        secret: "mysecret",
                    },
                },
            );

            await expect(ecInfo.get(uuid(), { secret: "mysecret" })).to.become(recordData);
        });
    });
});
