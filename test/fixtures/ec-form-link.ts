import { v4 as uuid } from "uuid";

import { ECFormLinkItem } from "../../src/resources/ECFormLinks";
import { TransactionTokenType } from "../../src/resources/TransactionTokens";

export const generateFixture = (): ECFormLinkItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    formId: uuid(),

    expiry: null,
    description: null,
    jwt: "myjwt",
    secret: "mysecret",

    amount: 100,
    amountFormatted: "100",
    currency: "JPY",
    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),

    tokenType: TransactionTokenType.ONE_TIME,
    tokenOnly: false,
});
