/**
 *  @module Resources/Cancels
 */

import { AuthParams, PollParams, ResponseCallback, SendData } from "../api/RestAPI";

import { ProcessingMode } from "./common/enums";
import { Metadata, PaymentError } from "./common/types";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";

export enum CancelStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error",
}

/* Request */
export type CancelsListParams = CRUDPaginationParams;

export interface CancelCreateParams {
    metadata?: Metadata;
}

/* Response */
export interface CancelItem {
    id: string;
    chargeId: string;
    storeId?: string;
    status: CancelStatus;
    error?: PaymentError;
    metadata?: Metadata;
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
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCancels>
    ): Promise<ResponseCancels> {
        return this._listRoute()(data, callback, auth, { storeId, chargeId });
    }

    create(
        storeId: string,
        chargeId: string,
        data: SendData<CancelCreateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCancel>
    ): Promise<ResponseCancel> {
        return this._createRoute(Cancels.requiredParams)(data, callback, auth, { storeId, chargeId });
    }

    get(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCancel>
    ): Promise<ResponseCancel> {
        return this._getRoute()(data, callback, auth, { storeId, chargeId, id });
    }

    poll(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCancel>,

        /**
         * Condition to cancel the polling and return `null`,
         */
        cancelCondition?: (response: ResponseCancel) => boolean,
        successCondition: ({ status }: ResponseCancel) => boolean = ({ status }) => status !== CancelStatus.PENDING
    ): Promise<ResponseCancel> {
        const pollingData = { ...data, polling: true };
        const promise: () => Promise<ResponseCancel> = () => this.get(storeId, chargeId, id, pollingData, auth);

        return this.api.longPolling(promise, successCondition, cancelCondition, callback);
    }
}
