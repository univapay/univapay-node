/**
 * @module Resources/Products
 */
import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { SubscriptionPeriod } from "./Subscriptions.js";
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

    createdOn: string;
    updatedOn: string;
    active: boolean;

    metadata?: Record<string, string>;
};

export type ResponseProduct = ProductItem;

export class Products extends CRUDResource {
    static routeBase = "/checkout/products";

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseProduct> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }

    private _getByCode?: DefinedRoute;
    getByCode(code: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseProduct> {
        this._getByCode = this._getByCode ?? this.defineRoute(HTTPMethod.GET, "/checkout/products/code/:code");
        return this._getByCode(data, auth, { code });
    }
}
