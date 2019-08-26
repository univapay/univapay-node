import 'isomorphic-fetch';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai from 'sinon-chai';
import chaiArrays from 'chai-arrays';
import fetchMock from 'fetch-mock';

/* Chai plugins */
chai.use(chaiAsPromised);
chai.use(sinonChai);
chai.use(chaiArrays);
chai.should();

(fetchMock as any).config.Request = Request;

export const testEndpoint = 'http://mock-api';
