/**
 *  @module Resources/WebHooks
 */

import { ResponseCallback, ErrorResponse, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';

export enum WebHookTrigger {
    // Store
    CHARGE_FINISHED = 'charge_finished',
    CHARGE_UPDATED = 'charge_updated',
    SUBSCRIPTION_PAYMENT = 'subscription_payment',
    SUBSCRIPTION_FAILURE = 'subscription_failure',
    SUBSCRIPTION_CANCELED = 'subscription_canceled',
    SUBSCRIPTION_COMPLETED = 'subscription_completed',
    SUBSCRIPTION_SUSPENDED = 'subscription_suspended',
    REFUND_FINISHED = 'refund_finished',
    CANCEL_FINISHED = 'cancel_finished',

    // Merchant
    TRANSFER_CREATED = 'transfer_created',
    TRANSFER_UPDATED = 'transfer_updated',
    TRANSFER_FINALIZED = 'transfer_finalized',
}

/* Request */
export type WebHooksListParams = CRUDPaginationParams;

export interface WebHookCreateParams<Trigger = WebHookTrigger> {
    triggers: Trigger[];
    url: string;
}
export interface WebHookUpdateParams<Trigger = WebHookTrigger> {
    triggers?: Trigger[];
    url?: string;
}

/* Response */
export interface WebHookItem<Trigger = WebHookTrigger> {
    id: string;
    merchantId: string;
    storeId: string;
    triggers: Trigger[];
    url: string;
    createdOn: string;
}

export type ResponseWebHook = WebHookItem;
export type ResponseWebHooks = CRUDItemsResponse<WebHookItem>;

export class WebHooks extends CRUDResource {
    static requiredParams: string[] = ['triggers', 'url'];

    static routeBase: string = '(/stores/:storeId)/webhooks';

    list(
        data?: SendData<WebHooksListParams>,
        callback?: ResponseCallback<ResponseWebHooks>,
        storeId?: string,
    ): Promise<ResponseWebHooks> {
        return this._listRoute()(data, callback, ['storeId'], storeId);
    }

    create(
        data: SendData<WebHookCreateParams>,
        callback?: ResponseCallback<ResponseWebHook>,
        storeId?: string,
    ): Promise<ResponseWebHook> {
        return this._createRoute(WebHooks.requiredParams)(data, callback, ['storeId'], storeId);
    }

    get(
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ResponseWebHook>,
        storeId?: string,
    ): Promise<ResponseWebHook> {
        return this._getRoute()(data, callback, ['storeId', 'id'], storeId, id);
    }

    update(
        id: string,
        data?: SendData<WebHookUpdateParams>,
        callback?: ResponseCallback<ResponseWebHook>,
        storeId?: string,
    ): Promise<ResponseWebHook> {
        return this._updateRoute()(data, callback, ['storeId', 'id'], storeId, id);
    }

    delete(
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ErrorResponse>,
        storeId?: string,
    ): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, ['storeId', 'id'], storeId, id);
    }
}
