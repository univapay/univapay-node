import { expect } from "chai";

const constantsPath = "../../src/common/constants.js";

// Constants are evaluated on import, the query string forces a fresh module instance per test
const importConstants = (key: string) => import(`${constantsPath}?${key}`);

describe("Constants", () => {
    afterEach(() => {
        delete process.env.POLLING_TIMEOUT;
        delete process.env.POLLING_INTERVAL;
    });

    it("should read polling settings from environment variables", async () => {
        process.env.POLLING_TIMEOUT = "1234";
        process.env.POLLING_INTERVAL = "56";

        const { POLLING_TIMEOUT, POLLING_INTERVAL } = await importConstants("env");

        expect(POLLING_TIMEOUT).to.equal(1234);
        expect(POLLING_INTERVAL).to.equal(56);
    });

    it("should fallback to default polling settings when environment variables are not numbers", async () => {
        process.env.POLLING_TIMEOUT = "foo";
        process.env.POLLING_INTERVAL = "bar";

        const { POLLING_TIMEOUT, POLLING_INTERVAL } = await importConstants("invalid-env");

        expect(POLLING_TIMEOUT).to.equal(600000);
        expect(POLLING_INTERVAL).to.equal(1000);
    });
});
