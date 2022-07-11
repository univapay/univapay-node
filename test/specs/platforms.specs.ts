import { expect } from "chai";
import fetchMock from "fetch-mock";

import { RestAPI } from "../../src/api/RestAPI.js";
import { Platforms } from "../../src/resources/Platforms.js";
import { generateFixture as generatePlatform } from "../fixtures/platforms.js";
import { testEndpoint } from "../utils/index.js";

describe("Platforms", () => {
    let api: RestAPI;
    let platforms: Platforms;

    const recordData = generatePlatform();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        platforms = new Platforms(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /platform", () => {
        it("should get response", async () => {
            fetchMock.getOnce(`${testEndpoint}/platform`, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(platforms.getConfiguration()).to.become(recordData);
        });
    });
});
