/**
 *  @module Resources/Stores
 */

import { AuthParams, SendData } from "../api/RestAPI.js";

import { ConfigurationCreateParams, ConfigurationItem, ConfigurationUpdateParams } from "./common/Configuration.js";
import { WithMerchantName } from "./common/types.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

export enum ProductSelection {
    ALL = "all",
    MANUAL = "manual",
}

export enum ReceivingType {
    USER = "user",
    STORE = "store",
    USER_OR_STORE = "user_or_store",
}

export enum SupportedCardBrand {
    VISA = "visa",
    MASTERCARD = "mastercard",
    JCB = "jcb",
    AMEX = "american_express",
    DINERS = "diners_club",
}

export enum CartType {
    SINGLE_PRODUCT = "single_product",
    MULTIPLE_PRODUCT = "multiple_product",
}

export type Cart = {
    items: string[];
    type: CartType;
    id?: string; // TODO Confirm if carts will have 'id'
    name?: string;
};

/* Request */
export interface StoresListParams extends CRUDPaginationParams {
    search?: string;
}
export interface StoreCreateParams {
    name: string;
    configuration?: ConfigurationCreateParams;
    logo?: any; // For logo image upload
}
export interface StoreUpdateParams {
    name?: string;
    configuration?: ConfigurationUpdateParams;
    logo?: any; // For logo image upload
}

/* Response */
export interface StoreItem {
    id: string;
    merchantId: string;
    name: string;
    createdOn: string;
    configuration: ConfigurationItem;
}

export type StoreListItem = WithMerchantName<StoreItem>;

export type ResponseStore = StoreItem;
export type ResponseStores = CRUDItemsResponse<StoreListItem>;

export class Stores extends CRUDResource {
    static requiredParams: string[] = ["name"];
    static routeBase = "/stores";

    private _list?: DefinedRoute;
    list(data?: SendData<StoresListParams>, auth?: AuthParams): Promise<ResponseStores> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth);
    }

    private _create?: DefinedRoute;
    create(data: SendData<StoreCreateParams>, auth?: AuthParams): Promise<ResponseStore> {
        this._create = this._create ?? this._createRoute({ requiredParams: Stores.requiredParams });
        return this._create(data, auth);
    }

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseStore> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }

    private _update?: DefinedRoute;
    update(id: string, data?: SendData<StoreUpdateParams>, auth?: AuthParams): Promise<ResponseStore> {
        this._update = this._update ?? this._updateRoute();
        return this._update(data, auth, { id });
    }

    private _delete?: DefinedRoute;
    delete(id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        this._delete = this._delete ?? this._deleteRoute();
        return this._delete(data, auth, { id });
    }
}
