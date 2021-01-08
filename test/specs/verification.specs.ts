import { expect } from "chai";
import fetchMock from "fetch-mock";

import { RestAPI } from "../../src/api/RestAPI";
import { RequestError } from "../../src/errors/RequestResponseError";
import { BusinessTypes } from "../../src/resources/Corporation";
import { RecurringTokenPrivilege } from "../../src/resources/TransactionTokens";
import { Verification, VerificationCreateParams, VerificationUpdateParams } from "../../src/resources/Verification";
import { createRequestError } from "../fixtures/errors";
import { generateFixture as generateVerification } from "../fixtures/verification";
import { testEndpoint } from "../utils";

describe("Verification", () => {
    let api: RestAPI;
    let verification: Verification;

    const verificationData = {
        homepageUrl: "http://fake.com",
        companyDescription: "Description",
        companyContactInfo: {
            name: "Joe Doe",
            companyName: "Company LTD.",
            phoneNumber: {
                countryCode: "81",
                localNumber: "1234567890",
            },
            line1: "Test",
            line2: "Test",
            city: "Tokyo",
            state: "Tokyo",
            country: "JP",
            zip: "111-1111",
        },
        businessType: BusinessTypes.CONSULTING,
        systemManagerName: "Joe Doe",
        systemManagerNumber: {
            countryCode: "81",
            localNumber: "1234567890",
        },
        systemManagerEmail: "test@fake.com",
        recurringTokenRequest: RecurringTokenPrivilege.NONE,
        recurringTokenRequestReason: "Reason",
        allowEmptyCvv: false,
    };

    const recordPathMatcher = `${testEndpoint}/verification`;
    const recordData = generateVerification();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        verification = new Verification(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST /verification", () => {
        it("should get response", async () => {
            fetchMock.postOnce(recordPathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: VerificationCreateParams = {
                ...verificationData,
            };

            await expect(verification.create(data)).to.eventually.eql(recordData);
        });

        it("should return validation error if data is invalid", async () => {
            const { homepageUrl, companyDescription, companyContactInfo, businessType } = verificationData;

            const asserts: [Partial<VerificationCreateParams>, RequestError][] = [
                [{}, createRequestError(["homepageUrl"])],
                [{ homepageUrl }, createRequestError(["companyDescription"])],
                [{ homepageUrl, companyDescription }, createRequestError(["companyContactInfo"])],
                [{ homepageUrl, companyDescription, companyContactInfo }, createRequestError(["businessType"])],
                [
                    { homepageUrl, companyDescription, companyContactInfo, businessType },
                    createRequestError(["systemManagerName"]),
                ],
            ];

            for (const [data, error] of asserts) {
                await expect(verification.create(data as VerificationCreateParams))
                    .to.eventually.be.rejectedWith(RequestError)
                    .that.has.property("errorResponse")
                    .which.eql(error.errorResponse);
            }
        });
    });

    context("GET /verification", () => {
        it("should get response", async () => {
            fetchMock.getOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(verification.get()).to.eventually.eql(recordData);
        });
    });

    context("PATCH /verification", () => {
        it("should get response", async () => {
            fetchMock.patchOnce(recordPathMatcher, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            const data: VerificationUpdateParams = {
                ...verificationData,
            };

            await expect(verification.update(data)).to.eventually.eql(recordData);
        });
    });
});
