/**
 *  @module Resources/Charges
 */
import { PollParams, ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from './CRUDResource';
import { Metadata, PaymentError } from './common/types';
import { ProcessingMode } from './common/enums';
import { CaptureStatus } from './Captures';
import { TransactionTokenType } from './TransactionTokens';
export declare enum ChargeStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error",
    CANCELED = "canceled",
    AWAITING = "awaiting",
    AUTHORIZED = "authorized"
}
export declare type ChargesListParams = CRUDPaginationParams;
export interface ChargeCreateParams {
    transactionTokenId: string;
    amount: number;
    currency: string;
    captureAt?: string | number;
    capture?: boolean;
    descriptor?: string;
    ignoreDescriptorOnError?: boolean;
    onlyDirectCurrency?: boolean;
    metadata?: Metadata;
}
export interface ChargeItem {
    id: string;
    merchantId: string;
    storeId: string;
    ledgerId?: string;
    subscriptionId?: string;
    requestedAmount: number;
    requestedCurrency: string;
    requestedAmountFormatted: number;
    chargedAmount: number;
    chargedCurrency: string;
    chargedAmountFormatted: number;
    captureAt?: string;
    captureStatus?: CaptureStatus;
    status: ChargeStatus;
    error?: PaymentError;
    metadata?: Metadata;
    mode: ProcessingMode;
    createdOn: string;
    transactionTokenId?: string;
    transactionTokenType: TransactionTokenType;
    descriptor: string;
    onlyDirectCurrency: boolean;
}
export declare type ResponseCharge = ChargeItem;
export declare type ResponseCharges = CRUDItemsResponse<ChargeItem>;
export declare class Charges extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    list(data?: SendData<ChargesListParams>, callback?: ResponseCallback<ResponseCharges>, storeId?: string): Promise<ResponseCharges>;
    create(data: SendData<ChargeCreateParams>, callback?: ResponseCallback<ResponseCharge>): Promise<ResponseCharge>;
    get(storeId: string, id: string, data?: SendData<PollParams>, callback?: ResponseCallback<ResponseCharge>): Promise<ResponseCharge>;
    poll(storeId: string, id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseCharge>): Promise<ResponseCharge>;
}
