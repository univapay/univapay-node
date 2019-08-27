import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import * as sinon from 'sinon';
import { SinonSandbox } from 'sinon';
import uuid from 'uuid';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import {
    TransactionTokens,
    TransactionTokenCreateParams,
    TransactionTokenUpdateParams,
    PaymentType,
    TransactionTokenType,
} from '../../src/resources/TransactionTokens';
import { RestAPI } from '../../src/api/RestAPI';
import { generateList } from '../fixtures/list';
import { generateFixture as generateTransactionToken } from '../fixtures/transaction-tokens';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';

describe('Transaction Tokens', function() {
    let api: RestAPI;
    let transactionTokens: TransactionTokens;
    let sandbox: SinonSandbox;

    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/tokens/:id`);
    const recordData = generateTransactionToken();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        transactionTokens = new TransactionTokens(api);
        sandbox = sinon.createSandbox({
            properties: ['spy', 'clock'],
            useFakeTimers: true,
        });
    });

    afterEach(function() {
        fetchMock.restore();
        sandbox.restore();
    });

    context('POST /tokens', function() {
        it('should get response', async function() {
            fetchMock.postOnce(`${testEndpoint}/tokens`, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: TransactionTokenCreateParams = {
                paymentType: PaymentType.CARD,
                type: TransactionTokenType.ONE_TIME,
                email: 'test@fake.com',
                data: {
                    cardholder: 'Joe Doe',
                    cardNumber: '4242424242424242',
                    expMonth: '12',
                    expYear: '99',
                    cvv: '123',
                },
            };

            await expect(transactionTokens.create(data)).to.eventually.eql(recordData);
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<TransactionTokenCreateParams>, RequestError][] = [
                [{}, createRequestError(['paymentType'])],
                [{ paymentType: PaymentType.CARD }, createRequestError(['type'])],
                [
                    { paymentType: PaymentType.CARD, type: TransactionTokenType.ONE_TIME, email: 'test@fake.com' },
                    createRequestError(['data']),
                ],
            ];

            for (const [data, error] of asserts) {
                await expect(transactionTokens.create(data as TransactionTokenCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    context('GET [/stores/:storeId]/tokens', function() {
        it('should get response', async function() {
            const listData = generateList({
                count: 10,
                recordGenerator: generateTransactionToken,
            });

            fetchMock.get(pathToRegexMatcher(`${testEndpoint}/:storesPart(stores/[^/]+)?/tokens`), {
                status: 200,
                body: listData,
                headers: { 'Content-Type': 'application/json' },
            });

            const asserts = [transactionTokens.list(), transactionTokens.list(null, null, uuid())];

            for (const assert of asserts) {
                await expect(assert).to.eventually.eql(listData);
            }
        });
    });

    context('GET /stores/:storeId/tokens/:id', function() {
        it('should get response', async function() {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(transactionTokens.get(uuid(), uuid())).to.eventually.eql(recordData);
        });
    });

    context('PATCH /stores/:storeId/tokens/:id', function() {
        it('should get response', async function() {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: TransactionTokenUpdateParams = {
                email: 'test@fake.com',
            };

            await expect(transactionTokens.update(uuid(), uuid(), data)).to.eventually.eql(recordData);
        });
    });

    context('DELETE /stores/:storeId/tokens/:id', function() {
        it('should get response', async function() {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(transactionTokens.delete(uuid(), uuid(), null)).to.eventually.be.empty;
        });
    });

    context('POST /stores/:storeId/tokens/:id', function() {
        it('should get response', async function() {
            fetchMock.postOnce(pathToRegexMatcher(`${testEndpoint}/stores/:storeId/tokens/:id/confirm`), {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data = {
                confirmationCode: '1234',
            };

            await expect(transactionTokens.confirm(uuid(), uuid(), data)).to.eventually.eql(recordData);
        });
    });

    it('should return request error when parameters for route are invalid', async function() {
        const errorId = createRequestError(['id']);
        const errorStoreId = createRequestError(['storeId']);

        const asserts: [Promise<any>, RequestError][] = [
            [transactionTokens.get(null, null), errorStoreId],
            [transactionTokens.get(null, uuid()), errorStoreId],
            [transactionTokens.get(uuid(), null), errorId],
            [transactionTokens.update(null, null), errorStoreId],
            [transactionTokens.update(null, uuid()), errorStoreId],
            [transactionTokens.update(uuid(), null), errorId],
            [transactionTokens.delete(null, null), errorStoreId],
            [transactionTokens.delete(null, uuid()), errorStoreId],
            [transactionTokens.delete(uuid(), null), errorId],
        ];

        for (const [request, error] of asserts) {
            await expect(request)
                .to.eventually.be.rejectedWith(RequestError)
                .that.has.property('errorResponse')
                .which.eql(error.errorResponse);
        }
    });
});
