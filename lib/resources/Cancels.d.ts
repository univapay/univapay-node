/**
 *  @module Resources/Cancels
 */
import { ResponseCallback, PollParams, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
import { PaymentError, Metadata } from './common/types';
import { ProcessingMode } from './common/enums';
export declare enum CancelStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error"
}
export declare type CancelsListParams = CRUDPaginationParams;
export interface CancelCreateParams {
    metadata?: Metadata;
}
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
export declare type ResponseCancel = CancelItem;
export declare type ResponseCancels = CRUDItemsResponse<CancelItem>;
export declare class Cancels extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    list(storeId: string, chargeId: string, data?: SendData<CancelsListParams>, callback?: ResponseCallback<ResponseCancels>): Promise<ResponseCancels>;
    create(storeId: string, chargeId: string, data: SendData<CancelCreateParams>, callback?: ResponseCallback<ResponseCancel>): Promise<ResponseCancel>;
    get(storeId: string, chargeId: string, id: string, data?: SendData<PollParams>, callback?: ResponseCallback<ResponseCancel>): Promise<ResponseCancel>;
    poll(storeId: string, chargeId: string, id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseCancel>): Promise<ResponseCancel>;
}
