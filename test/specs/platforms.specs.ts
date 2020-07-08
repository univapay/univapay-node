import { expect } from "chai";
import fetchMock from "fetch-mock";

import { RestAPI } from "../../src/api/RestAPI";
import { Platforms } from "../../src/resources/Platforms";
import { generateFixture as generatePlatform } from "../fixtures/platforms";
import { testEndpoint } from "../utils";

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

            await expect(platforms.getConfiguration()).to.eventually.eql(recordData);
        });
    });
});
