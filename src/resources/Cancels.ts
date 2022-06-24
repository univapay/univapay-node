/**
 *  @module Resources/Cancels
 */

import { PaymentError } from "../errors/APIError.js";
import { AuthParams, PollData, PollParams, SendData } from "../api/RestAPI.js";

import { ProcessingMode } from "./common/enums.js";
import { Metadata } from "./common/types.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";

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

    list(
        storeId: string,
        chargeId: string,
        data?: SendData<CancelsListParams>,
        auth?: AuthParams
    ): Promise<ResponseCancels> {
        return this._listRoute()(data, auth, { storeId, chargeId });
    }

    create(
        storeId: string,
        chargeId: string,
        data: SendData<CancelCreateParams>,
        auth?: AuthParams
    ): Promise<ResponseCancel> {
        return this._createRoute({ requiredParams: Cancels.requiredParams })(data, auth, { storeId, chargeId });
    }

    get(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams
    ): Promise<ResponseCancel> {
        return this._getRoute()(data, auth, { storeId, chargeId, id });
    }

    poll(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        pollParams?: Partial<PollParams<ResponseCancel>>
    ): Promise<ResponseCancel> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseCancel> = () => this.get(storeId, chargeId, id, pollData, auth);
        const successCondition = pollParams?.successCondition ?? (({ status }) => status !== CancelStatus.PENDING);

        return this.api.longPolling(promise, { ...pollParams, successCondition });
    }
}
