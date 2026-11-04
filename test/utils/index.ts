import * as chai from "chai";
import chaiArrays from "chai-arrays";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
import { SinonSandboxConfig } from "sinon";
import sinonChai from "sinon-chai";

/* Chai plugins */
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiArrays);
chai.should();

fetchMock.mockGlobal();

export const testEndpoint = "http://mock-api";

// Native fetch reads response bodies through setImmediate, faking it stalls every mocked request
export const fakeTimersConfig: SinonSandboxConfig["useFakeTimers"] = {
    toFake: ["setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date"],
};
