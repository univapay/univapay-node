/**
 * @module Resources/Products
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { TransactionTokenType } from "./TransactionTokens.js";

export type ProductItem = {
    id: string;
    storeId: string;
    merchantId: string;
    platformId: string;

    name: string;
    code: string;
    amount: number;
    currency: string;
    tokenType: TransactionTokenType;
    description?: string | null;
    shippingFees?: number | null;

    createdOn: string;
    updatedOn: string;
    active: boolean;
};

export type ResponseProduct = ProductItem;

export class Products extends CRUDResource {
    static routeBase = "/checkout/products";

    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseProduct> {
        return this._getRoute()(data, auth, { id });
    }
}
