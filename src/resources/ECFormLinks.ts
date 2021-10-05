/**
 *  @module Resources/ECFormLinks
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI";

import { CRUDResource } from "./CRUDResource";

export type ECFormLinkItem = {
    id: string;
    merchantId: string;
    storeId: string;
    formId: string;

    description: string | null;

    expiry: string | null;
    jwt: string;
    secret: string;

    amount: number;
    amountFormatted: string;
    currency: string;
    createdOn: string;
    updatedOn: string;
};

export type ResponseECFormLink = ECFormLinkItem;

export class ECFormLinks extends CRUDResource {
    static routeBase = "/checkout/links";

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseECFormLink>
    ): Promise<ResponseECFormLink> {
        return this._getRoute()(data, callback, auth, { id });
    }
}
