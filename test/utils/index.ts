import chai from "chai";
import chaiArrays from "chai-arrays";
import chaiAsPromised from "chai-as-promised";
import fetchMock from "fetch-mock";
import sinonChai from "sinon-chai";

import "cross-fetch/polyfill";

/* Chai plugins */
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiArrays);
chai.should();

fetchMock.config.Request = Request;

export const testEndpoint = "http://mock-api";
