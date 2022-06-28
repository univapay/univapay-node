/**
 *  @module Resources/ECInfo
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { ECFormLinkItem } from "./ECFormLinks.js";
import { ECFormItem } from "./ECForms.js";
import { DefinedRoute } from "./Resource.js";

export type ECInfoItem = {
    form: ECFormItem;
    link: ECFormLinkItem;
};

export type ECInfoGetParams = { secret: string };
export type ResponseECInfo = ECInfoItem;

export class ECInfo extends CRUDResource {
    static routeBase = "/checkout/info";

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<ECInfoGetParams>, auth?: AuthParams): Promise<ResponseECInfo> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }
}
