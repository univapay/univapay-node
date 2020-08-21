/**
 *  @module Resources/WebHooks
 */

import { AuthParams, ErrorResponse, ResponseCallback, SendData } from "../api/RestAPI";

import { WithStoreMerchantName } from "./common/types";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";

export enum WebHookTrigger {
    // Store
    CHARGE_FINISHED = "charge_finished",
    CHARGE_UPDATED = "charge_updated",
    SUBSCRIPTION_PAYMENT = "subscription_payment",
    SUBSCRIPTION_FAILURE = "subscription_failure",
    SUBSCRIPTION_CANCELED = "subscription_canceled",
    SUBSCRIPTION_COMPLETED = "subscription_completed",
    SUBSCRIPTION_SUSPENDED = "subscription_suspended",
    REFUND_FINISHED = "refund_finished",
    CANCEL_FINISHED = "cancel_finished",

    // Merchant
    TRANSFER_CREATED = "transfer_created",
    TRANSFER_UPDATED = "transfer_updated",
    TRANSFER_FINALIZED = "transfer_finalized",
}

/* Request */
export type WebHooksListParams = CRUDPaginationParams;

export interface WebHookCreateParams<Trigger = WebHookTrigger> {
    triggers: Trigger[];
    url: string;
    authToken?: string;
}
export interface WebHookUpdateParams<Trigger = WebHookTrigger> {
    triggers?: Trigger[];
    url?: string;
    authToken?: string;
}

/* Response */
export interface WebHookItem<Trigger = WebHookTrigger> {
    id: string;
    merchantId: string;
    storeId: string;
    triggers: Trigger[];
    url: string;
    authToken?: string;
    createdOn: string;
}

export type WebHookListItem<TriggerType> = WithStoreMerchantName<WebHookItem<TriggerType>>;

export type ResponseWebHook<TriggerType> = WebHookItem<TriggerType>;
export type ResponseWebHooks<TriggerType> = CRUDItemsResponse<WebHookListItem<TriggerType>>;

export class WebHooks<TriggerType = WebHookTrigger> extends CRUDResource {
    static requiredParams: string[] = ["triggers", "url"];

    static routeBase = "(/stores/:storeId)/webhooks";

    list(
        data?: SendData<WebHooksListParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseWebHooks<TriggerType>>,
        storeId?: string
    ): Promise<ResponseWebHooks<TriggerType>> {
        return this._listRoute()(data, callback, auth, { storeId });
    }

    create(
        data: SendData<WebHookCreateParams<TriggerType>>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseWebHook<TriggerType>>,
        storeId?: string
    ): Promise<ResponseWebHook<TriggerType>> {
        return this._createRoute(WebHooks.requiredParams)(data, callback, auth, { storeId });
    }

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseWebHook<TriggerType>>,
        storeId?: string
    ): Promise<ResponseWebHook<TriggerType>> {
        return this._getRoute()(data, callback, auth, { storeId, id });
    }

    update(
        id: string,
        data?: SendData<WebHookUpdateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseWebHook<TriggerType>>,
        storeId?: string
    ): Promise<ResponseWebHook<TriggerType>> {
        return this._updateRoute()(data, callback, auth, { storeId, id });
    }

    delete(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ErrorResponse>,
        storeId?: string
    ): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, auth, { storeId, id });
    }
}
