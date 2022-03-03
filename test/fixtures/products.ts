import { v4 as uuid } from "uuid";

import { ProductItem } from "../../src/resources/Products";
import { TransactionTokenType } from "../../src/resources/TransactionTokens";

export const generateFixture = (): ProductItem => ({
    id: uuid(),
    storeId: uuid(),
    merchantId: uuid(),
    platformId: uuid(),

    name: "dummy product",
    amount: 100,
    currency: "JPY",
    tokenType: TransactionTokenType.ONE_TIME,
    description: null,
    shippingFees: null,

    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),
    active: true,
});
