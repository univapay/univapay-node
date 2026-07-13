/**
 *  @module Resources/CustomerManagement
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { CustomerRole } from "./common/Configuration.js";

export type CustomerManagementAuthenticateResponse = {
    /**
     * Parsed value of type ParsedAuthenticateToken
     */
    jwt: string;
};

export type CustomerManagementAuthenticatePayload = {
    email: string;
    otp: string;
};

export type CustomerManagementSendCodePayload = {
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

export class CustomerManagement extends CRUDResource {
    static routeBase = "(/stores/:storeId)/customers";

    private _authorize: DefinedRoute;
    authorize(
        storeId: string,
        data: SendData<CustomerManagementAuthenticatePayload>,
        auth?: AuthParams,
    ): Promise<CustomerManagementAuthenticateResponse> {
        this._authorize =
            this._authorize ?? this.defineRoute(HTTPMethod.POST, "(/stores/:storeId)/customers/authenticate");
        return this._authorize(data, auth, { storeId });
    }

    private _sendCode: DefinedRoute;
    sendCode(
        storeId: string,
        data: SendData<CustomerManagementSendCodePayload>,
        auth?: AuthParams,
    ): Promise<CustomerManagementAuthenticateResponse> {
        this._sendCode =
            this._sendCode ?? this.defineRoute(HTTPMethod.POST, "(/stores/:storeId)/customers/authenticate");
        return this._sendCode(data, auth, { storeId });
    }
}
