import { v4 as uuid } from "uuid";

import { BankAccountItem, BankAccountStatus, BankAccountType } from "../../src/resources/BankAccounts.js";

export const generateFixture = (): BankAccountItem => ({
    id: uuid(),
    holderName: "Joe Doe",
    bankName: "Bank",
    branchName: "Branch",
    country: "JP",
    bankAddress: "Address",
    currency: "JPY",
    swiftCode: "FAKECODE",
    lastFour: "7890",
    status: BankAccountStatus.VERIFIED,
    primary: true,
    accountNumber: "1234567890",
    accountType: BankAccountType.REGULAR,
    createdOn: new Date().toISOString(),
});
