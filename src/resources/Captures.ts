/**
 *  @module Resources/Captures
 */

import { AuthParams, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";

/* Request */
export enum CaptureStatus {
    Authorized = "authorized",
    Captured = "captured",
    NotAuthorized = "not_authorized",
}

export type CaptureItem = {
    amount: number;
    currency: string;
};

export type CaptureCreateParams = {
    amount: number;
    currency: string;
};

/* Response */

export class Captures extends CRUDResource {
    static requiredParams: string[] = ["amount", "currency"];

    static routeBase = "/stores/:storeId/charges/:chargeId/capture";

    create(
        storeId: string,
        chargeId: string,
        data: SendData<CaptureCreateParams>,
        auth?: AuthParams
    ): Promise<CaptureItem> {
        return this._createRoute({ requiredParams: Captures.requiredParams })(data, auth, { storeId, chargeId });
    }
}
