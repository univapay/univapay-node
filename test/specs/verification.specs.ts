import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { pick } from 'lodash';
import { testEndpoint } from '../utils';
import { Verification, VerificationCreateParams, VerificationUpdateParams } from '../../src/resources/Verification';
import { RecurringTokenPrivilege } from '../../src/resources/TransactionTokens';
import { RestAPI } from '../../src/api/RestAPI';
import { generateFixture as generateVerification } from '../fixtures/verification';
import { RequestError } from '../../src/errors/RequestResponseError';
import { createRequestError } from '../fixtures/errors';

describe('Verification', function() {
    let api: RestAPI;
    let verification: Verification;

    const verificationData = {
        homepageUrl: 'http://fake.com',
        companyDescription: 'Description',
        companyContactInfo: {
            name: 'Joe Doe',
            companyName: 'Company LTD.',
            phoneNumber: {
                countryCode: '81',
                localNumber: '1234567890',
            },
            line1: 'Test',
            line2: 'Test',
            city: 'Tokyo',
            state: 'Tokyo',
            country: 'JP',
            zip: '111-1111',
        },
        businessType: 'TODO',
        systemManagerName: 'Joe Doe',
        systemManagerNumber: {
            countryCode: '81',
            localNumber: '1234567890',
        },
        systemManagerEmail: 'test@fake.com',
        recurringTokenRequest: RecurringTokenPrivilege.NONE,
        recurringTokenRequestReason: 'Reason',
        allowEmptyCvv: false,
    };

    const recordPathMatcher = `${testEndpoint}/verification`;
    const recordData = generateVerification();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        verification = new Verification(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('POST /verification', function() {
        it('should get response', async function() {
            fetchMock.postOnce(recordPathMatcher, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: VerificationCreateParams = {
                ...verificationData,
            };

            await expect(verification.create(data)).to.eventually.eql(recordData);
        });

        it('should return validation error if data is invalid', async function() {
            const asserts: [Partial<VerificationCreateParams>, RequestError][] = [
                [{}, createRequestError(['homepageUrl'])],
                [pick(verificationData, 'homepageUrl'), createRequestError(['companyDescription'])],
                [
                    pick(verificationData, 'homepageUrl', 'companyDescription'),
                    createRequestError(['companyContactInfo']),
                ],
                [
                    pick(verificationData, 'homepageUrl', 'companyDescription', 'companyContactInfo'),
                    createRequestError(['businessType']),
                ],
                [
                    pick(verificationData, 'homepageUrl', 'companyDescription', 'companyContactInfo', 'businessType'),
                    createRequestError(['systemManagerName']),
                ],
            ];

            for (const [data, error] of asserts) {
                await expect(verification.create(data as VerificationCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property('errorResponse')
                    .which.eql(error.errorResponse);
            }
        });
    });

    context('GET /verification', function() {
        it('should get response', async function() {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            await expect(verification.get()).to.eventually.eql(recordData);
        });
    });

    context('PATCH /verification', function() {
        it('should get response', async function() {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });

            const data: VerificationUpdateParams = {
                ...verificationData,
            };

            await expect(verification.update(data)).to.eventually.eql(recordData);
        });
    });
});
