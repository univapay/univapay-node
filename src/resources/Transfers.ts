/**
 *  @module Resources/Transfers
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { Metadata, WithMerchantName } from "./common/types.js";
import { CRUDAOSItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

export enum TransferStatus {
    CREATED = "created",
    APPROVED = "approved",
    CANCELED = "canceled",
    PROCESSING = "processing",
    PAID = "paid",
    FAILED = "failed",
    BLANK = "blank",
}

/* Request */
export interface TransfersListParams extends CRUDPaginationParams {
    currency?: string;
    status?: TransferStatus;
    startedBy?: string;
}

/* Response */
export interface TransferItem<T extends Metadata = Metadata> {
    id: string;
    merchantId: string;
    bankAccountId: string;
    amount: number;
    currency: string;
    amountFormatted: number;
    status: TransferStatus;
    errorCode?: string;
    errorText?: string;
    metadata?: T;
    startedBy: string;
    createdOn: string;
    from: string;
    to: string;
}

export type TransferListItem = WithMerchantName<TransferItem>;

export interface TransferStatusChangeItem {
    id: string;
    merchantId: string;
    transferId: string;
    oldStatus: TransferStatus;
    newStatus: TransferStatus;
    reason?: string;
    createdOn: string;
}

export type ResponseTransfer = TransferItem;
export type ResponseTransfers = CRUDAOSItemsResponse<TransferListItem>;
export type ResponseTransferStatusChanges = CRUDAOSItemsResponse<TransferStatusChangeItem>;

export class Transfers extends CRUDResource {
    static routeBase = "/transfers";

    private _list?: DefinedRoute;
    list(data?: SendData<TransfersListParams>, auth?: AuthParams): Promise<ResponseTransfers> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth);
    }

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseTransfer> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }

    private _statusChanges?: DefinedRoute;
    statusChanges(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseTransferStatusChanges> {
        this._statusChanges =
            this._statusChanges ?? this.defineRoute(HTTPMethod.GET, `${Transfers.routeBase}/:id/status_changes`);
        return this._statusChanges(data, auth, { id });
    }
}
