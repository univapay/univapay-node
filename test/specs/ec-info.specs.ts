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

            await expect(ecInfo.get(uuid(), { secret: "mysecret" })).to.become(recordData);
        });
    });
});
