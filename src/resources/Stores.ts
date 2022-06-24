/**
 *  @module Resources/Stores
 */

import { AuthParams, SendData } from "../api/RestAPI.js";

import { ConfigurationCreateParams, ConfigurationItem, ConfigurationUpdateParams } from "./common/Configuration.js";
import { WithMerchantName } from "./common/types.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";

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

    list(data?: SendData<StoresListParams>, auth?: AuthParams): Promise<ResponseStores> {
        return this._listRoute()(data, auth);
    }

    create(data: SendData<StoreCreateParams>, auth?: AuthParams): Promise<ResponseStore> {
        return this._createRoute({ requiredParams: Stores.requiredParams })(data, auth);
    }

    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseStore> {
        return this._getRoute()(data, auth, { id });
    }

    update(id: string, data?: SendData<StoreUpdateParams>, auth?: AuthParams): Promise<ResponseStore> {
        return this._updateRoute()(data, auth, { id });
    }

    delete(id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        return this._deleteRoute()(data, auth, { id });
    }
}
