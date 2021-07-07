/**
 *  @module Resources/ECInfo
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI";

import { CRUDResource } from "./CRUDResource";
import { ECFormLinkItem } from "./ECFormLinks";
import { ECFormItem } from "./ECForms";
import { EmailItem } from "./Emails";

export type ECInfoItem = {
    id: string;
    jwt: string;

    form: ECFormItem;
    link: ECFormLinkItem;
    email: EmailItem;
};

export type ECInfoGetParams = { secret: string };
export type ResponseECInfo = ECInfoItem;

export class ECInfo extends CRUDResource {
    static routeBase = "/checkout/info";

    get(
        id: string,
        data?: SendData<ECInfoGetParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseECInfo>
    ): Promise<ResponseECInfo> {
        return this._getRoute()(data, callback, auth, { id });
    }
}
