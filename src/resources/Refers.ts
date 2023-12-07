/**
 *  @module Resources/Refers
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { CustomerRole } from "./common/Configuration.js";

export type ReferAuthenticateResponse = {
    /**
     * Parsed value of type ParsedAuthenticateToken
     */
    jwt: string;
};

export type ReferAuthenticatePayload = {
    email: string;
    otp: string;
};

export type ReferSendCodePayload = {
    email: string;
};

export type ParsedAuthenticateToken = {
    email: string;
    roles: CustomerRole[];
    store_id: string;
    name: string;
    lang: string;
    logo_uri: string;
    ip_address: string;
};

export class Refers extends CRUDResource {
    static routeBase = "(/stores/:storeId)/customers";

    private _authorize: DefinedRoute;
    authorize(
        storeId: string,
        data: SendData<ReferAuthenticatePayload>,
        auth?: AuthParams,
    ): Promise<ReferAuthenticateResponse> {
        this._authorize =
            this._authorize ?? this.defineRoute(HTTPMethod.POST, "(/stores/:storeId)/customers/authenticate");
        return this._authorize(data, auth, { storeId });
    }

    private _sendCode: DefinedRoute;
    sendCode(
        storeId: string,
        data: SendData<ReferSendCodePayload>,
        auth?: AuthParams,
    ): Promise<ReferAuthenticateResponse> {
        this._sendCode =
            this._sendCode ?? this.defineRoute(HTTPMethod.POST, "(/stores/:storeId)/customers/authenticate");
        return this._sendCode(data, auth, { storeId });
    }
}
