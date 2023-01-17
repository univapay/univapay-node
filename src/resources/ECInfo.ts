/**
 *  @module Resources/ECInfo
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

import { CRUDResource } from "./CRUDResource.js";
import { ECFormLinkItem } from "./ECFormLinks.js";
import { ECFormItem, Languages } from "./ECForms.js";
import { LinkProductListItem } from "./LinksProducts.js";
import { DefinedRoute } from "./Resource.js";

export type ECInfoItem = {
    form: ECFormItem;
    link: ECFormLinkItem;
    product: LinkProductListItem;
};

export type ECInfoGetParams = { secret: string };
export type ResponseECInfo = ECInfoItem;

export class ECInfo extends CRUDResource {
    static routeBase = "/checkout/info";

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<ECInfoGetParams>, auth?: AuthParams): Promise<ResponseECInfo> {
        const ignoreKeysFormatting = ["metadata", ...Object.values(Languages)];
        this._get = this._get ?? this._getRoute({ ignoreKeysFormatting });
        return this._get(data, auth, { id });
    }
}
