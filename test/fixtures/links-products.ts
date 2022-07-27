import { v4 as uuid } from "uuid";
import { TransactionTokenType } from "../../src/resources/TransactionTokens.js";
import { LinkProductListItem } from "../../src/resources/LinksProducts.js";

export const generateFixture = (): LinkProductListItem => ({
    id: uuid(),
    platformId: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    name: "dummy product",
    description: null,
    amount: 100,
    currency: "JPY",
    shippingFees: null,
    tokenType: TransactionTokenType.ONE_TIME,
    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),
    code: null,
    quantity: 1,
});
