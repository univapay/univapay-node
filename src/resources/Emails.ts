/**
 *  @module Resources/Emails
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

export type EmailItem = {
    id: string;
    merchantId: string;
    storeId: string;
    formId: string;
    linkId: string;

    email: string;
    customerName?: string;
    lang: string;
    createdOn: string;
};

export type ResponseEmail = EmailItem;

export class Emails extends CRUDResource {
    static routeBase = "/checkout/emails";

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseEmail> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }
}
