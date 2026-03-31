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

export type TransferListItem<T extends Metadata = Metadata> = WithMerchantName<TransferItem<T>>;

export interface TransferStatusChangeItem {
    id: string;
    merchantId: string;
    transferId: string;
    oldStatus: TransferStatus;
    newStatus: TransferStatus;
    reason?: string;
    createdOn: string;
}

export type ResponseTransfer<T extends Metadata = Metadata> = TransferItem<T>;
export type ResponseTransfers<T extends Metadata = Metadata> = CRUDAOSItemsResponse<TransferListItem<T>>;
export type ResponseTransferStatusChanges = CRUDAOSItemsResponse<TransferStatusChangeItem>;

export class Transfers extends CRUDResource {
    static routeBase = "/transfers";

    private _list?: DefinedRoute;
    list<T extends Metadata = Metadata>(data?: SendData<TransfersListParams>, auth?: AuthParams): Promise<ResponseTransfers<T>> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth);
    }

    private _get?: DefinedRoute;
    get<T extends Metadata = Metadata>(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseTransfer<T>> {
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
