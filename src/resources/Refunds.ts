/**
 *  @module Resources/Refunds
 */

import { PollParams, ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
import { PaymentError, Metadata } from './common/types';
import { ProcessingMode } from './common/enums';

export enum RefundStatus {
    PENDING = 'pending',
    SUCCESSFUL = 'successful',
    FAILED = 'failed',
    ERROR = 'error',
}

export enum RefundReason {
    DUPLICATE = 'duplicate',
    FRAUD = 'fraud',
    CUSTOMER_REQUEST = 'customer_request',
    CHARGEBACK = 'chargeback',
}

/* Request */
export type RefundsListParams = CRUDPaginationParams;

export interface RefundCreateParams {
    amount: number;
    currency: string;
    reason?: RefundReason;
    message?: string;
    metadata?: Metadata;
}

export interface RefundUpdateParams {
    status?: RefundStatus;
    reason?: RefundReason;
    message?: string;
    metadata?: Metadata;
}

/* Response */
export interface RefundItem {
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
    metadata?: Metadata;
    mode: ProcessingMode;
    createdOn: string;
}

export type ResponseRefund = RefundItem;
export type ResponseRefunds = CRUDItemsResponse<RefundItem>;

export class Refunds extends CRUDResource {
    static requiredParams: string[] = ['amount', 'currency'];

    static routeBase = '/stores/:storeId/charges/:chargeId/refunds';

    list(
        storeId: string,
        chargeId: string,
        data?: SendData<RefundsListParams>,
        callback?: ResponseCallback<ResponseRefunds>,
    ): Promise<ResponseRefunds> {
        return this._listRoute()(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    }

    create(
        storeId: string,
        chargeId: string,
        data: SendData<RefundCreateParams>,
        callback?: ResponseCallback<ResponseRefund>,
    ): Promise<ResponseRefund> {
        return this._createRoute(Refunds.requiredParams)(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    }

    get(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<PollParams>,
        callback?: ResponseCallback<ResponseRefund>,
    ): Promise<ResponseRefund> {
        return this._getRoute()(data, callback, ['storeId', 'chargeId', 'id'], storeId, chargeId, id);
    }

    update(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<RefundUpdateParams>,
        callback?: ResponseCallback<ResponseRefund>,
    ): Promise<ResponseRefund> {
        return this._updateRoute()(data, callback, ['storeId', 'chargeId', 'id'], storeId, chargeId, id);
    }

    poll(
        storeId: string,
        chargeId: string,
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ResponseRefund>,
    ): Promise<ResponseRefund> {
        const promise: () => Promise<ResponseRefund> = () =>
            this.get(storeId, chargeId, id, { ...(data as object), polling: true });

        return this.api.longPolling(
            promise,
            (response: ResponseRefund) => response.status !== RefundStatus.PENDING,
            callback,
        );
    }
}
