/**
 *  @module Resources/Ledgers
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

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

export type LedgerListItem = LedgerItem;

export type ResponseLedgers = CRUDItemsResponse<LedgerListItem>;
export type ResponseLedger = LedgerItem;

export class Ledgers extends CRUDResource {
    static routeBase = "/transfers/:transferId/ledgers";

    private _list?: DefinedRoute;
    list(transferId: string, data?: LedgersListParams, auth?: AuthParams): Promise<ResponseLedgers> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth, { transferId });
    }

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseLedger> {
        this._get = this._get ?? this.defineRoute(HTTPMethod.GET, "/ledgers/:id");
        return this._get(data, auth, { id });
    }
}
