import { v4 as uuid } from "uuid";

import { ProcessingMode } from "../../src/resources/common/enums.js";
import { TemporaryTokenAliasItem } from "../../src/resources/TemporaryTokenAlias.js";
import { PaymentType, TransactionTokenType } from "../../src/resources/TransactionTokens.js";

export const generateFixture = (): TemporaryTokenAliasItem => ({
    id: uuid(),
    platformId: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    email: "test@fake.com",
    paymentType: PaymentType.CARD,
    active: true,
    mode: ProcessingMode.TEST,
    type: TransactionTokenType.ONE_TIME,
    createdOn: new Date().toISOString(),
    lastUsedOn: new Date().toISOString(),
    amount: 1000,
    currency: "JPY",
    aliasMetadata: {},
});
