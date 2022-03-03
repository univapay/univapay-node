/**
 * @module Resources/Products
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI";

import { CRUDResource } from "./CRUDResource";
import { TransactionTokenType } from "./TransactionTokens";

export type ProductItem = {
    id: string;
    storeId: string;
    merchantId: string;
    platformId: string;

    name: string;
    amount: number;
    currency: string;
    tokenType: TransactionTokenType;
    description?: string | null;
    shippingFees?: number | null;

    createdOn: Date; 
    updatedOn: Date;
    active: boolean;
}

export type ResponseProduct = ProductItem;

export class Products extends CRUDResource {
    static routeBase = "/products";

    get(
      id: string,
      data?: SendData<void>,
      auth?: AuthParams,
      callback?: ResponseCallback<ResponseProduct>
    ): Promise<ResponseProduct> 
    {
      return this._getRoute()(data, callback, auth, { id });
    }
}
