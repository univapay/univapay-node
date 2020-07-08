/**
 *  @module Resources/Stores
 */

import { ErrorResponse, ResponseCallback, SendData } from "../api/RestAPI";

import { ConfigurationCreateParams, ConfigurationItem, ConfigurationUpdateParams } from "./common/Configuration";
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

export type ResponseStore = StoreItem;
export type ResponseStores = CRUDItemsResponse<StoreItem>;

export class Stores extends CRUDResource {
    static requiredParams: string[] = ["name"];

    static routeBase = "/stores";

    list(data?: SendData<StoresListParams>, callback?: ResponseCallback<ResponseStores>): Promise<ResponseStores> {
        return this._listRoute()(data, callback);
    }

    create(data: SendData<StoreCreateParams>, callback?: ResponseCallback<ResponseStore>): Promise<ResponseStore> {
        return this._createRoute(Stores.requiredParams)(data, callback);
    }

    get(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseStore>): Promise<ResponseStore> {
        return this._getRoute()(data, callback, ["id"], id);
    }

    update(
        id: string,
        data?: SendData<StoreUpdateParams>,
        callback?: ResponseCallback<ResponseStore>
    ): Promise<ResponseStore> {
        return this._updateRoute()(data, callback, ["id"], id);
    }

    delete(id: string, data?: SendData<void>, callback?: ResponseCallback<ErrorResponse>): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, ["id"], id);
    }
}
