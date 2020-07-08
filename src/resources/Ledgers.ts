/**
 *  @module Resources/Ledgers
 */

import { HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";

export enum LedgerOrigin {
    CHARGE = "charge",
    REFUND = "refund",
    MANUAL = "manual",
}

/* Request */
export interface LedgersListParams extends CRUDPaginationParams {
    all?: boolean;
    from?: number | string;
    to?: number | string;
    min?: number;
    max?: number;
    currency?: string;
}

/* Response */
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

export type ResponseLedgers = CRUDItemsResponse<LedgerItem>;
export type ResponseLedger = LedgerItem;

export class Ledgers extends CRUDResource {
    static routeBase = "/transfers/:transferId/ledgers";

    list(
        transferId: string,
        data?: LedgersListParams,
        callback?: ResponseCallback<ResponseLedgers>
    ): Promise<ResponseLedgers> {
        return this._listRoute()(data, callback, ["transferId"], transferId);
    }

    get(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseLedger>): Promise<ResponseLedger> {
        return this.defineRoute(HTTPMethod.GET, "/ledgers/:id")(data, callback, ["id"], id);
    }
}
