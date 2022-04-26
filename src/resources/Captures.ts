/**
 *  @module Resources/Captures
 */

import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";

/* Request */
export enum CaptureStatus {
    Authorized = "authorized",
    Captured = "captured",
    NotAuthorized = "not_authorized",
}

export interface CaptureCreateParams {
    amount: number;
    currency: string;
}

/* Response */

export class Captures extends CRUDResource {
    static requiredParams: string[] = ["amount", "currency"];

    static routeBase = "/stores/:storeId/charges/:chargeId/capture";

    create(
        storeId: string,
        chargeId: string,
        data: SendData<CaptureCreateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<any>
    ): Promise<any> {
        return this._createRoute(Captures.requiredParams)(data, callback, auth, { storeId, chargeId });
    }
}
