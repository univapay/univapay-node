/**
 *  @module Resources/Emails
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI";

import { ChargeStatus } from "./Charges";
import { CRUDResource } from "./CRUDResource";
import { ECFormItem } from "./ECForms";

export type EmailItem = {
    id: string;
    amount: number;
    amountFormatted: string;
    currency: string;
    email: string;
    lang: string;
    merchantId: string;
    storeId: string;
    createdOn: string;
    updatedOn: string;
    form: ECFormItem;
    status: ChargeStatus;
};

export type ResponseEmail = EmailItem;

export class Emails extends CRUDResource {
    static routeBase = "/merchants/:merchantId/checkout/emails";

    get(
        merchantId: string,
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<EmailItem>
    ): Promise<ResponseEmail> {
        return this._getRoute()(data, callback, auth, { merchantId, id });
    }
}
