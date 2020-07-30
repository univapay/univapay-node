/**
 *  @module Resources/Stores
 */

import { AuthParams, ErrorResponse, ResponseCallback, SendData } from "../api/RestAPI";

import { ConfigurationCreateParams, ConfigurationItem, ConfigurationUpdateParams } from "./common/Configuration";
import { WithMerchantName } from "./common/types";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";

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

    list(
        data?: SendData<StoresListParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseStores>
    ): Promise<ResponseStores> {
        return this._listRoute()(data, callback, auth);
    }

    create(
        data: SendData<StoreCreateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseStore>
    ): Promise<ResponseStore> {
        return this._createRoute(Stores.requiredParams)(data, callback, auth);
    }

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseStore>
    ): Promise<ResponseStore> {
        return this._getRoute()(data, callback, auth, { id });
    }

    update(
        id: string,
        data?: SendData<StoreUpdateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseStore>
    ): Promise<ResponseStore> {
        return this._updateRoute()(data, callback, auth, { id });
    }

    delete(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ErrorResponse>
    ): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, auth, { id });
    }
}
