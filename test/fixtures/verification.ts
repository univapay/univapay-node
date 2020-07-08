import { v4 as uuid } from "uuid";

import { RecurringTokenPrivilege } from "../../src/resources/TransactionTokens";
import { VerificationItem } from "../../src/resources/Verification";

export const generateFixture = (): VerificationItem => ({
    id: uuid(),
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
    businessType: "TODO",
    systemManagerName: "Joe Doe",
    systemManagerNumber: {
        countryCode: "81",
        localNumber: "1234567890",
    },
    systemManagerEmail: "test@fake.com",
    recurringTokenRequest: RecurringTokenPrivilege.NONE,
    recurringTokenRequestReason: "Reason",
    allowEmptyCvv: false,
    createdOn: new Date().toISOString(),
});
