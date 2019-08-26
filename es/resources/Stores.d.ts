/**
 *  @module Resources/Stores
 */
import { ResponseCallback, ErrorResponse, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
import { ConfigurationCreateParams, ConfigurationUpdateParams, ConfigurationItem } from './common/Configuration';
export interface StoresListParams extends CRUDPaginationParams {
    search?: string;
}
export interface StoreCreateParams {
    name: string;
    configuration?: ConfigurationCreateParams;
    logo?: any;
}
export interface StoreUpdateParams {
    name?: string;
    configuration?: ConfigurationUpdateParams;
    logo?: any;
}
export interface StoreItem {
    id: string;
    merchantId: string;
    name: string;
    createdOn: string;
    configuration: ConfigurationItem;
}
export declare type ResponseStore = StoreItem;
export declare type ResponseStores = CRUDItemsResponse<StoreItem>;
export declare class Stores extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    list(data?: SendData<StoresListParams>, callback?: ResponseCallback<ResponseStores>): Promise<ResponseStores>;
    create(data: SendData<StoreCreateParams>, callback?: ResponseCallback<ResponseStore>): Promise<ResponseStore>;
    get(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseStore>): Promise<ResponseStore>;
    update(id: string, data?: SendData<StoreUpdateParams>, callback?: ResponseCallback<ResponseStore>): Promise<ResponseStore>;
    delete(id: string, data?: SendData<void>, callback?: ResponseCallback<ErrorResponse>): Promise<ErrorResponse>;
}
