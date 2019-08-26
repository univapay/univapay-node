/**
 *  @module Resources/Transfers
 */
import { ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
import { Metadata } from './common/types';
export declare enum TransferStatus {
    CREATED = "created",
    APPROVED = "approved",
    CANCELED = "canceled",
    PROCESSING = "processing",
    PAID = "paid",
    FAILED = "failed",
    BLANK = "blank"
}
export interface TransfersListParams extends CRUDPaginationParams {
    currency?: string;
    status?: TransferStatus;
    startedBy?: string;
}
export interface TransferItem {
    id: string;
    merchantId: string;
    bankAccountId: string;
    amount: number;
    currency: string;
    amountFormatted: number;
    status: TransferStatus;
    errorCode?: string;
    errorText?: string;
    metadata?: Metadata;
    startedBy: string;
    createdOn: string;
    from: string;
    to: string;
}
export interface TransferStatusChangeItem {
    id: string;
    merchantId: string;
    transferId: string;
    oldStatus: TransferStatus;
    newStatus: TransferStatus;
    reason?: string;
    createdOn: string;
}
export declare type ResponseTransfer = TransferItem;
export declare type ResponseTransfers = CRUDItemsResponse<TransferItem>;
export declare type ResponseTransferStatusChanges = CRUDItemsResponse<TransferStatusChangeItem>;
export declare class Transfers extends CRUDResource {
    static routeBase: string;
    list(data?: SendData<TransfersListParams>, callback?: ResponseCallback<ResponseTransfers>): Promise<ResponseTransfers>;
    get(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseTransfer>): Promise<ResponseTransfer>;
    statusChanges(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseTransferStatusChanges>): Promise<ResponseTransferStatusChanges>;
}
