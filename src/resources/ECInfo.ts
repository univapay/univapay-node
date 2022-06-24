/**
 *  @module Resources/ECInfo
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { ECFormLinkItem } from "./ECFormLinks.js";
import { ECFormItem } from "./ECForms.js";

export type ECInfoItem = {
    form: ECFormItem;
    link: ECFormLinkItem;
};

export type ECInfoGetParams = { secret: string };
export type ResponseECInfo = ECInfoItem;

export class ECInfo extends CRUDResource {
    static routeBase = "/checkout/info";

    get(id: string, data?: SendData<ECInfoGetParams>, auth?: AuthParams): Promise<ResponseECInfo> {
        return this._getRoute()(data, auth, { id });
    }
}
