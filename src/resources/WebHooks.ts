/**
 *  @module Resources/WebHooks
 */

import { AuthParams, SendData } from "../api/RestAPI.js";

import { WithStoreMerchantName } from "./common/types.js";
import { CRUDAOSItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

export enum WebHookTrigger {
    // Store
    TOKEN_CREATED = "token_created",
    CHARGE_FINISHED = "charge_finished",
    CHARGE_UPDATED = "charge_updated",
    SUBSCRIPTION_CREATED = "subscription_created",
    SUBSCRIPTION_PAYMENT = "subscription_payment",
    SUBSCRIPTION_FAILURE = "subscription_failure",
    SUBSCRIPTION_CANCELED = "subscription_canceled",
    SUBSCRIPTION_COMPLETED = "subscription_completed",
    SUBSCRIPTION_SUSPENDED = "subscription_suspended",
    REFUND_FINISHED = "refund_finished",
    CANCEL_FINISHED = "cancel_finished",
    RECURRING_TOKEN_DELETED = "recurring_token_deleted",
    RECURRING_TOKEN_RENEW = "recurring_token_renew",
    CUSTOMS_DECLARATION_FINISHED = "customs_declaration_finished",
    TOKEN_UPDATED = "token_updated",
    TOKEN_CVV_AUTH_UPDATED = "token_cvv_auth_updated",
    TOKEN_CVV_AUTH_CHECK_UPDATED = "token_cvv_auth_check_updated",

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
export type ResponseWebHooks<TriggerType> = CRUDAOSItemsResponse<WebHookListItem<TriggerType>>;

export class WebHooks<TriggerType = WebHookTrigger> extends CRUDResource {
    static requiredParams: string[] = ["triggers", "url"];

    static routeBase = "(/stores/:storeId)/webhooks";

    private _list?: DefinedRoute;
    list(
        data?: SendData<WebHooksListParams>,
        auth?: AuthParams,
        storeId?: string,
    ): Promise<ResponseWebHooks<TriggerType>> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth, { storeId });
    }

    private _create?: DefinedRoute;
    create(
        data: SendData<WebHookCreateParams<TriggerType>>,
        auth?: AuthParams,
        storeId?: string,
    ): Promise<ResponseWebHook<TriggerType>> {
        this._create = this._create ?? this._createRoute({ requiredParams: WebHooks.requiredParams });
        return this._create(data, auth, { storeId });
    }

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams, storeId?: string): Promise<ResponseWebHook<TriggerType>> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, id });
    }

    private _update?: DefinedRoute;
    update(
        id: string,
        data?: SendData<WebHookUpdateParams>,
        auth?: AuthParams,
        storeId?: string,
    ): Promise<ResponseWebHook<TriggerType>> {
        this._update = this._update ?? this._updateRoute();
        return this._update(data, auth, { storeId, id });
    }

    private _delete?: DefinedRoute;
    delete(id: string, data?: SendData<void>, auth?: AuthParams, storeId?: string): Promise<void> {
        this._delete = this._delete ?? this._deleteRoute();
        return this._delete(data, auth, { storeId, id });
    }
}
