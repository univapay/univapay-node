/**
 *  @module Resources/Emails
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";

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

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseEmail>
    ): Promise<ResponseEmail> {
        return this._getRoute()(data, callback, auth, { id });
    }
}
