/**
 *  @module Resources/Refunds
 */

import { AuthParams, PollParams, PollData, SendData } from "../api/RestAPI.js";

import { PaymentError } from "../errors/APIError.js";
import { ProcessingMode } from "./common/enums.js";
import { Metadata } from "./common/types.js";
import { CRUDAOSItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

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
    metadata?: T | string;
}

export interface RefundUpdateParams<T extends Metadata = Metadata> {
    status?: RefundStatus;
    reason?: RefundReason;
    message?: string;

    /**
     * Metadata or stringified JSON object
     */
    metadata?: T | string;
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
    updatedOn: string;
}

export type RefundListItem = RefundItem;

export type ResponseRefund = RefundItem;
export type ResponseRefunds = CRUDAOSItemsResponse<RefundListItem>;

export class Refunds extends CRUDResource {
    static requiredParams: string[] = ["amount", "currency"];

    static routeBase = "/stores/:storeId/charges/:chargeId/refunds";

    private _list?: DefinedRoute;
    list(
        storeId: string,
        chargeId: string,
        data?: SendData<RefundsListParams>,
        auth?: AuthParams,
    ): Promise<ResponseRefunds> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth, { storeId, chargeId });
    }

    private _create?: DefinedRoute;
    create(
        storeId: string,
        chargeId: string,
        data: SendData<RefundCreateParams>,
        auth?: AuthParams,
    ): Promise<ResponseRefund> {
        this._create = this._create ?? this._createRoute({ requiredParams: Refunds.requiredParams });
        return this._create(data, auth, { storeId, chargeId });
    }

    private _get?: DefinedRoute;
    get(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
    ): Promise<ResponseRefund> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, chargeId, id });
    }

    private _update?: DefinedRoute;
    update(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<RefundUpdateParams>,
        auth?: AuthParams,
    ): Promise<ResponseRefund> {
        this._update = this._update ?? this._updateRoute();
        return this._update(data, auth, { storeId, chargeId, id });
    }

    poll(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        pollParams?: Partial<PollParams<ResponseRefund>>,
    ): Promise<ResponseRefund> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseRefund> = () => this.get(storeId, chargeId, id, pollData, auth);
        const successCondition = pollParams?.successCondition ?? (({ status }) => status !== RefundStatus.PENDING);

        return this.api.longPolling(promise, { ...pollParams, successCondition });
    }
}
