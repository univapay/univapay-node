/**
 *  @module Resources/TemporaryTokenAlias
 */
import * as tslib_1 from "tslib";
import { CRUDResource } from './CRUDResource';
import { HTTPMethod } from '../api/RestAPI';
export var TemporaryTokenAliasQrLogoType;
(function (TemporaryTokenAliasQrLogoType) {
    TemporaryTokenAliasQrLogoType["None"] = "None";
    TemporaryTokenAliasQrLogoType["Centered"] = "Centered";
    TemporaryTokenAliasQrLogoType["Background"] = "Background";
})(TemporaryTokenAliasQrLogoType || (TemporaryTokenAliasQrLogoType = {}));
export var TemporaryTokenAliasMedia;
(function (TemporaryTokenAliasMedia) {
    TemporaryTokenAliasMedia["Json"] = "json";
    TemporaryTokenAliasMedia["QR"] = "qr";
})(TemporaryTokenAliasMedia || (TemporaryTokenAliasMedia = {}));
var TemporaryTokenAlias = /** @class */ (function (_super) {
    tslib_1.__extends(TemporaryTokenAlias, _super);
    function TemporaryTokenAlias() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TemporaryTokenAlias.prototype.create = function (data, callback) {
        return this.defineRoute(HTTPMethod.POST, '/tokens/alias', TemporaryTokenAlias.requiredParams)(data, callback);
    };
    TemporaryTokenAlias.prototype.get = function (storeId, id, data, callback) {
        return this.defineRoute(HTTPMethod.GET, this._routeBase + "/:id", undefined, undefined, data && data.media === TemporaryTokenAliasMedia.QR ? 'image/png' : undefined)(data, callback, ['storeId', 'id'], storeId, id);
    };
    TemporaryTokenAlias.prototype.delete = function (storeId, id, data, callback) {
        return this._deleteRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    TemporaryTokenAlias.requiredParams = ['transactionTokenId'];
    TemporaryTokenAlias.routeBase = '/stores/:storeId/tokens/alias';
    return TemporaryTokenAlias;
}(CRUDResource));
export { TemporaryTokenAlias };
//# sourceMappingURL=TemporaryTokenAlias.js.map