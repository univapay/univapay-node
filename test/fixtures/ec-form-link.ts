import { v4 as uuid } from "uuid";

import { ECFormLinkItem } from "../../src/resources/ECFormLinks.js";
import { TransactionTokenType } from "../../src/resources/TransactionTokens.js";

export const generateFixture = (): ECFormLinkItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    formId: uuid(),

    enabled: true,
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
    hideCvv: false,
    allowCardInstallments: false,
});
