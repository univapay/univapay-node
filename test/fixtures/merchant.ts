import { v4 as uuid } from "uuid";

import { MerchantItem } from "../../src/resources/Merchants";
import { RecurringTokenPrivilege } from "../../src/resources/TransactionTokens";

import { generateFixture as generateConfiguration } from "./common/configuration";
import { generateFixture as generateTransferSchedule } from "./common/transfer-schedule";

export const generateFixture = (): MerchantItem => ({
    id: uuid(),
    verificationDataId: uuid(),
    name: "Joe Doe",
    email: "test@fake.com",
    verified: true,
    configuration: {
        ...generateConfiguration(),
        displayTimeZone: "Asia/Tokyo",
        transferSchedule: generateTransferSchedule(),
        recurringTokenConfiguration: {
            recurringType: RecurringTokenPrivilege.NONE,
            chargeWaitPeriod: "P1D",
        },
        language: "JA_JP",
    },
    createdOn: new Date().toISOString(),
});
