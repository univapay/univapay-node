/**
 *  @module Resources/IssuerUrl
 */

import { ResponseCallback, SendData } from "../api/RestAPI";

import { ProcessingMode } from "./common/enums";
import { Metadata, PaymentError } from "./common/types";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";

export type CancelsListParams = CRUDPaginationParams;

/* Response */
export interface IssuerUrlItem {
    issuerToken: string;
    httpMethod: string;
    chargeId: string;
    storeId?: string;
    error?: PaymentError;
    metadata?: Metadata;
    mode: ProcessingMode;
    createdOn: string;
}

export type ResponseIssuerUrls = CRUDItemsResponse<IssuerUrlItem>;

export class IssuerUrls extends CRUDResource {
    static requiredParams: string[] = [];

    static routeBase = "/stores/:storeId/charges/:chargeId/issuerToken";

    list(
        storeId: string,
        chargeId: string,
        data?: SendData<CancelsListParams>,
        callback?: ResponseCallback<ResponseIssuerUrls>
    ): Promise<ResponseIssuerUrls> {
        return this._listRoute()(data, callback, ["storeId", "chargeId"], storeId, chargeId);
    }
}
