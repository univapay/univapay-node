/**
 *  @module Resources/Refunds
 */
import { PollParams, ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
import { PaymentError, Metadata } from './common/types';
import { ProcessingMode } from './common/enums';
export declare enum RefundStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error"
}
export declare enum RefundReason {
    DUPLICATE = "duplicate",
    FRAUD = "fraud",
    CUSTOMER_REQUEST = "customer_request",
    CHARGEBACK = "chargeback"
}
export declare type RefundsListParams = CRUDPaginationParams;
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
export declare type ResponseRefund = RefundItem;
export declare type ResponseRefunds = CRUDItemsResponse<RefundItem>;
export declare class Refunds extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    list(storeId: string, chargeId: string, data?: SendData<RefundsListParams>, callback?: ResponseCallback<ResponseRefunds>): Promise<ResponseRefunds>;
    create(storeId: string, chargeId: string, data: SendData<RefundCreateParams>, callback?: ResponseCallback<ResponseRefund>): Promise<ResponseRefund>;
    get(storeId: string, chargeId: string, id: string, data?: SendData<PollParams>, callback?: ResponseCallback<ResponseRefund>): Promise<ResponseRefund>;
    update(storeId: string, chargeId: string, id: string, data?: SendData<RefundUpdateParams>, callback?: ResponseCallback<ResponseRefund>): Promise<ResponseRefund>;
    poll(storeId: string, chargeId: string, id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseRefund>): Promise<ResponseRefund>;
}
