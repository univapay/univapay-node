/**
 *  @module Resources/WebHooks
 */
import { ResponseCallback, ErrorResponse, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
export declare enum WebHookTrigger {
    CHARGE_FINISHED = "charge_finished",
    CHARGE_UPDATED = "charge_updated",
    SUBSCRIPTION_PAYMENT = "subscription_payment",
    SUBSCRIPTION_FAILURE = "subscription_failure",
    SUBSCRIPTION_CANCELED = "subscription_canceled",
    SUBSCRIPTION_COMPLETED = "subscription_completed",
    SUBSCRIPTION_SUSPENDED = "subscription_suspended",
    REFUND_FINISHED = "refund_finished",
    CANCEL_FINISHED = "cancel_finished",
    TRANSFER_CREATED = "transfer_created",
    TRANSFER_UPDATED = "transfer_updated",
    TRANSFER_FINALIZED = "transfer_finalized"
}
export declare type WebHooksListParams = CRUDPaginationParams;
export interface WebHookCreateParams<Trigger = WebHookTrigger> {
    triggers: Trigger[];
    url: string;
}
export interface WebHookUpdateParams<Trigger = WebHookTrigger> {
    triggers?: Trigger[];
    url?: string;
}
export interface WebHookItem<Trigger = WebHookTrigger> {
    id: string;
    merchantId: string;
    storeId: string;
    triggers: Trigger[];
    url: string;
    createdOn: string;
}
export declare type ResponseWebHook = WebHookItem;
export declare type ResponseWebHooks = CRUDItemsResponse<WebHookItem>;
export declare class WebHooks extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    list(data?: SendData<WebHooksListParams>, callback?: ResponseCallback<ResponseWebHooks>, storeId?: string): Promise<ResponseWebHooks>;
    create(data: SendData<WebHookCreateParams>, callback?: ResponseCallback<ResponseWebHook>, storeId?: string): Promise<ResponseWebHook>;
    get(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseWebHook>, storeId?: string): Promise<ResponseWebHook>;
    update(id: string, data?: SendData<WebHookUpdateParams>, callback?: ResponseCallback<ResponseWebHook>, storeId?: string): Promise<ResponseWebHook>;
    delete(id: string, data?: SendData<void>, callback?: ResponseCallback<ErrorResponse>, storeId?: string): Promise<ErrorResponse>;
}
