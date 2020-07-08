import { v4 as uuid } from "uuid";

import { LedgerItem, LedgerOrigin } from "../../src/resources/Ledgers";

export const generateFixture = (): LedgerItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    transferId: uuid(),
    amount: 1000,
    currency: "JPY",
    amountFormatted: 1000,
    percentFee: 3.5,
    flatFee: 30,
    flatFeeCurrency: "JPY",
    flatFeeFormatted: 30,
    exchangeRate: 1,
    origin: LedgerOrigin.CHARGE,
    note: "Note",
    createdOn: new Date().toISOString(),
});
