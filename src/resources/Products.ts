/**
 * @module Resources/Products
 */
import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { Metadata } from "./common/types.js";
import { SubscriptionPeriod } from "./Subscriptions.js";
import { TransactionTokenType } from "./TransactionTokens.js";

export type ProductItem<T extends Metadata = Metadata> = {
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

    /**
     * ISO 8601 period. e.g P1M, P23D.
     */
    subscriptionStartIn?: string;
    subscriptionPreserveEndOfMonth?: boolean;

    /**
     * ISO 8601 period. e.g P1M, P23D.
     */
    subscriptionRetryInterval?: string;

    /**
     * ISO 8601 period. e.g P1M, P23D. Can not be used with the `period` parameter
     */
    subscriptionCyclicalPeriod?: string | null;
    subscriptionPeriod?: SubscriptionPeriod;

    createdOn: string;
    updatedOn: string;
    active: boolean;

    metadata?: T;
};

export type ResponseProduct<T extends Metadata = Metadata> = ProductItem<T>;

export class Products extends CRUDResource {
    static routeBase = "/checkout/products";

    private _get?: DefinedRoute;
    get<T extends Metadata = Metadata>(
        id: string,
        data?: SendData<void> | null,
        auth?: AuthParams,
    ): Promise<ResponseProduct<T>> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }

    private _getByCode?: DefinedRoute;
    getByCode<T extends Metadata = Metadata>(
        code: string,
        data?: SendData<void>,
        auth?: AuthParams,
    ): Promise<ResponseProduct<T>> {
        this._getByCode = this._getByCode ?? this.defineRoute(HTTPMethod.GET, "/checkout/products/code/:code");
        return this._getByCode(data, auth, { code });
    }
}
