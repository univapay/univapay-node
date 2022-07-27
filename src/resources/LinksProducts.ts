/**
 *  @module Resources/Products
 */

import { AuthParams, SendData } from "../api/RestAPI.js";
import { CRUDItemsResponse, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { TransactionTokenType } from "./TransactionTokens.js";

export type LinkProductListItem = {
    id: string;
    merchantId: string;
    storeId: string;
    name: string;
    description?: string | null;
    amount: number;
    currency: string;
    shippingFees?: number | null;
    tokenType: TransactionTokenType;
    createdOn: string;
    updatedOn: string;
    code: string | null;
    quantity: number;
};
export type ResponseLinkProducts = CRUDItemsResponse<LinkProductListItem> & {
    hasMore: false; // no support for pagination
};

export class LinksProducts extends CRUDResource {
    static routeBase = "/checkout/links/:linkId/products";

    private _list?: DefinedRoute;
    list(linkId: string, data?: SendData<{ [k: string]: never }>, auth?: AuthParams): Promise<ResponseLinkProducts> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth, { linkId });
    }
}
