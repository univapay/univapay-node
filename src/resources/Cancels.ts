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

export type CancelListItem<T extends Metadata = Metadata> = CancelItem<T>;

export type ResponseCancel<T extends Metadata = Metadata> = CancelItem<T>;
export type ResponseCancels<T extends Metadata = Metadata> = CRUDItemsResponse<CancelListItem<T>>;

export class Cancels extends CRUDResource {
    static requiredParams: string[] = [];
    static routeBase = "/stores/:storeId/charges/:chargeId/cancels";

    private _list?: DefinedRoute;
    list<T extends Metadata = Metadata>(
        storeId: string,
        chargeId: string,
        data?: SendData<CancelsListParams>,
        auth?: AuthParams,
    ): Promise<ResponseCancels<T>> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth, { storeId, chargeId });
    }

    private _create?: DefinedRoute;
    create<T extends Metadata = Metadata>(
        storeId: string,
        chargeId: string,
        data: SendData<CancelCreateParams>,
        auth?: AuthParams,
    ): Promise<ResponseCancel<T>> {
        this._create = this._create ?? this._createRoute({ requiredParams: Cancels.requiredParams });
        return this._create(data, auth, { storeId, chargeId });
    }

    private _get?: DefinedRoute;
    get<T extends Metadata = Metadata>(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
    ): Promise<ResponseCancel<T>> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, chargeId, id });
    }

    poll<T extends Metadata = Metadata>(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        pollParams?: Partial<PollParams<ResponseCancel<T>>>,
    ): Promise<ResponseCancel<T>> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseCancel<T>> = () => this.get(storeId, chargeId, id, pollData, auth);
        const successCondition = pollParams?.successCondition ?? (({ status }) => status !== CancelStatus.PENDING);

        return this.api.longPolling(promise, { ...pollParams, successCondition });
    }
}
