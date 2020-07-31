/**
 *  @module Resources/Transfers
 */

import { AuthParams, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import { Metadata, WithMerchantName } from "./common/types";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";

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

    list(
        data?: SendData<TransfersListParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseTransfers>
    ): Promise<ResponseTransfers> {
        return this._listRoute()(data, callback, auth);
    }

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseTransfer>
    ): Promise<ResponseTransfer> {
        return this._getRoute()(data, callback, auth, { id });
    }

    statusChanges(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseTransferStatusChanges>
    ): Promise<ResponseTransferStatusChanges> {
        return this.defineRoute(HTTPMethod.GET, `${Transfers.routeBase}/:id/status_changes`)(data, callback, auth, {
            id,
        });
    }
}
