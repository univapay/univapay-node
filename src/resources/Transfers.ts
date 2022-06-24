/**
 *  @module Resources/Transfers
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { Metadata, WithMerchantName } from "./common/types.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";

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
export type ResponseTransfers = CRUDItemsResponse<TransferListItem>;
export type ResponseTransferStatusChanges = CRUDItemsResponse<TransferStatusChangeItem>;

export class Transfers extends CRUDResource {
    static routeBase = "/transfers";

    list(data?: SendData<TransfersListParams>, auth?: AuthParams): Promise<ResponseTransfers> {
        return this._listRoute()(data, auth);
    }

    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseTransfer> {
        return this._getRoute()(data, auth, { id });
    }

    statusChanges(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseTransferStatusChanges> {
        return this.defineRoute(HTTPMethod.GET, `${Transfers.routeBase}/:id/status_changes`)(data, auth, {
            id,
        });
    }
}
