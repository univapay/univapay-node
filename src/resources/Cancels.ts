/**
 *  @module Resources/Cancels
 */

import { PaymentError } from "../errors/APIError.js";
import { AuthParams, PollData, PollParams, SendData } from "../api/RestAPI.js";

import { ProcessingMode } from "./common/enums.js";
import { Metadata } from "./common/types.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

export enum CancelStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error",
}

/* Request */
export type CancelsListParams = CRUDPaginationParams;

export interface CancelCreateParams<T extends Metadata = Metadata> {
    metadata?: T;
}

/* Response */
export interface CancelItem<T extends Metadata = Metadata> {
    id: string;
    chargeId: string;
    storeId?: string;
    status: CancelStatus;
    error?: PaymentError;
    metadata?: T;
    mode: ProcessingMode;
    createdOn: string;
}

export type CancelListItem = CancelItem;

export type ResponseCancel = CancelItem;
export type ResponseCancels = CRUDItemsResponse<CancelListItem>;

export class Cancels extends CRUDResource {
    static requiredParams: string[] = [];
    static routeBase = "/stores/:storeId/charges/:chargeId/cancels";

    private _list?: DefinedRoute;
    list(
        storeId: string,
        chargeId: string,
        data?: SendData<CancelsListParams>,
        auth?: AuthParams,
    ): Promise<ResponseCancels> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth, { storeId, chargeId });
    }

    private _create?: DefinedRoute;
    create(
        storeId: string,
        chargeId: string,
        data: SendData<CancelCreateParams>,
        auth?: AuthParams,
    ): Promise<ResponseCancel> {
        this._create = this._create ?? this._createRoute({ requiredParams: Cancels.requiredParams });
        return this._create(data, auth, { storeId, chargeId });
    }

    private _get?: DefinedRoute;
    get(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
    ): Promise<ResponseCancel> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, chargeId, id });
    }

    poll(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        pollParams?: Partial<PollParams<ResponseCancel>>,
    ): Promise<ResponseCancel> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseCancel> = () => this.get(storeId, chargeId, id, pollData, auth);
        const successCondition = pollParams?.successCondition ?? (({ status }) => status !== CancelStatus.PENDING);

        return this.api.longPolling(promise, { ...pollParams, successCondition });
    }
}
