import { v4 as uuid } from "uuid";

import { ECFormLinkItem } from "../../src/resources/ECFormLinks";

export const generateFixture = (): ECFormLinkItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    formId: uuid(),

    amount: 100,
    amountFormatted: "100",
    currency: "JPY",
    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),
});
