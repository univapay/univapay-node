/**
 * @module Resources/Products
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

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
    subscriptionPeriod?: SubscriptionPeriod;
    subscriptionInitialAmount?: number;
    subscriptionStartDayOfMonth?: number;
    subscriptionStartInMonths?: number;
    subscriptionStartIn?: string;

    createdOn: string;
    updatedOn: string;
    active: boolean;
};

export type ResponseProduct = ProductItem;

export class Products extends CRUDResource {
    static routeBase = "/checkout/products";

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseProduct> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }
}
