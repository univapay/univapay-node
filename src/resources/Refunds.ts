/**
 *  @module Resources/Refunds
 */

import { AuthParams, PollParams, ResponseCallback, SendData } from "../api/RestAPI.js";

import { ProcessingMode } from "./common/enums.js";
import { Metadata, PaymentError } from "./common/types.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";

export enum RefundStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error",
}

export enum RefundReason {
    DUPLICATE = "duplicate",
    FRAUD = "fraud",
    CUSTOMER_REQUEST = "customer_request",
    CHARGEBACK = "chargeback",
    SYSTEM_FAILURE = "system_failure",
}

/* Request */
export type RefundsListParams = CRUDPaginationParams;

export interface RefundCreateParams<T extends Metadata = Metadata> {
    amount: number;
    currency: string;
    reason?: RefundReason;
    message?: string;
    metadata?: T;
}

export interface RefundUpdateParams<T extends Metadata = Metadata> {
    status?: RefundStatus;
    reason?: RefundReason;
    message?: string;
    metadata?: T;
}

/* Response */
export interface RefundItem<T extends Metadata = Metadata> {
    id: string;
    storeId: string;
    chargeId: string;
    ledgerId?: string;
    status: RefundStatus;
    amount: number;
    currency: string;
    amountFormatted: number;
    reason?: RefundReason;
    message?: string;
    error?: PaymentError;
    metadata?: T;
    mode: ProcessingMode;
    createdOn: string;
}

export type RefundListItem = RefundItem;

export type ResponseRefund = RefundItem;
export type ResponseRefunds = CRUDItemsResponse<RefundListItem>;

export class Refunds extends CRUDResource {
    static requiredParams: string[] = ["amount", "currency"];

    static routeBase = "/stores/:storeId/charges/:chargeId/refunds";

    list(
        storeId: string,
        chargeId: string,
        data?: SendData<RefundsListParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseRefunds>
    ): Promise<ResponseRefunds> {
        return this._listRoute()(data, callback, auth, { storeId, chargeId });
    }

    create(
        storeId: string,
        chargeId: string,
        data: SendData<RefundCreateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseRefund>
    ): Promise<ResponseRefund> {
        return this._createRoute(Refunds.requiredParams)(data, callback, auth, { storeId, chargeId });
    }

    get(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseRefund>
    ): Promise<ResponseRefund> {
        return this._getRoute()(data, callback, auth, { storeId, chargeId, id });
    }

    update(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<RefundUpdateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseRefund>
    ): Promise<ResponseRefund> {
        return this._updateRoute()(data, callback, auth, { storeId, chargeId, id });
    }

    poll(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseRefund>,

        /**
         * Condition for the resource to be successfully loaded. Default to pending status check.
         */
        cancelCondition?: (response: ResponseRefund) => boolean,
        successCondition: ({ status }: ResponseRefund) => boolean = ({ status }) => status !== RefundStatus.PENDING
    ): Promise<ResponseRefund> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseRefund> = () => this.get(storeId, chargeId, id, pollData, auth);

        return this.api.longPolling(promise, successCondition, cancelCondition, callback);
    }
}
