/**
 *  @module Resources/Products
 */

import { AuthParams, SendData } from "../api/RestAPI.js";
import { CRUDItemsResponse, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { SubscriptionPeriod } from "./Subscriptions.js";
import { TransactionTokenType } from "./TransactionTokens.js";

export type LinkProductListItem = {
    id: string;
    merchantId: string;
    storeId: string;

    code: string | null;
    name: string;
    description?: string | null;
    createdOn: string;
    updatedOn: string;

    // Payment parameters
    amount: number;
    currency: string;
    shippingFees?: number | null;
    tokenType: TransactionTokenType;

    // Link parameters
    quantity: number;

    // Subscription parameters
    subscriptionCycles?: number;
    subscriptionInitialAmount?: number;
    subscriptionStartDayOfMonth?: number;
    subscriptionStartInMonths?: number;
    subscriptionStartIn?: string;

    /**
     * ISO 8601 period. e.g P1M, P23D. Can not be used with the `period` parameter
     */
    subscriptionCyclicalPeriod?: string | null;
    subscriptionPeriod?: SubscriptionPeriod;

    /**
     * ISO 8601 period. e.g P1M, P23D. Can not be used with the `period` parameter
     */
    subscriptionRetryInterval?: string | null;
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
