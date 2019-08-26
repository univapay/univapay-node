/**
 *  @module Resources/Ledgers
 */
import { ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
export declare enum LedgerOrigin {
    CHARGE = "charge",
    REFUND = "refund",
    MANUAL = "manual"
}
export interface LedgersListParams extends CRUDPaginationParams {
    all?: boolean;
    from?: number | string;
    to?: number | string;
    min?: number;
    max?: number;
    currency?: string;
}
export interface LedgerItem {
    id: string;
    merchantId: string;
    storeId?: string;
    transferId?: string;
    amount: number;
    currency: string;
    amountFormatted: number;
    percentFee: number;
    flatFee: number;
    flatFeeCurrency: string;
    flatFeeFormatted: number;
    exchangeRate: number;
    origin: LedgerOrigin;
    note?: string;
    createdOn: string;
}
export declare type ResponseLedgers = CRUDItemsResponse<LedgerItem>;
export declare type ResponseLedger = LedgerItem;
export declare class Ledgers extends CRUDResource {
    static routeBase: string;
    list(transferId: string, data?: LedgersListParams, callback?: ResponseCallback<ResponseLedgers>): Promise<ResponseLedgers>;
    get(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseLedger>): Promise<ResponseLedger>;
}
