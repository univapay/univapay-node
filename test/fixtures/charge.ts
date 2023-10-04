import { v4 as uuid } from "uuid";

import { ChargeItem, ChargeStatus } from "../../src/resources/Charges.js";
import { ProcessingMode } from "../../src/resources/common/enums.js";
import { TransactionTokenType } from "../../src/resources/TransactionTokens.js";

export const generateFixture = (overrides?: Partial<ChargeItem>): ChargeItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    transactionTokenId: uuid(),
    transactionTokenType: TransactionTokenType.ONE_TIME,
    subscriptionId: uuid(),
    requestedAmount: 1000,
    requestedCurrency: "JPY",
    requestedAmountFormatted: 1000,
    chargedAmount: 1000,
    chargedCurrency: "JPY",
    chargedAmountFormatted: 1000,
    captureAt: new Date().toISOString(),
    status: ChargeStatus.SUCCESSFUL,
    metadata: {},
    mode: ProcessingMode.TEST,
    createdOn: new Date().toISOString(),
    descriptor: "test",
    onlyDirectCurrency: false,
    feeAmount: 100,
    feeCurrency: "JPY",
    feeAmountFormatted: "100",
    ...overrides,
});
