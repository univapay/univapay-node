"use strict";
/**
 *  @module Resources/TemporaryTokenAlias
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CRUDResource_1 = require("./CRUDResource");
var RestAPI_1 = require("../api/RestAPI");
var TemporaryTokenAliasQrLogoType;
(function (TemporaryTokenAliasQrLogoType) {
    TemporaryTokenAliasQrLogoType["None"] = "None";
    TemporaryTokenAliasQrLogoType["Centered"] = "Centered";
    TemporaryTokenAliasQrLogoType["Background"] = "Background";
})(TemporaryTokenAliasQrLogoType = exports.TemporaryTokenAliasQrLogoType || (exports.TemporaryTokenAliasQrLogoType = {}));
var TemporaryTokenAliasMedia;
(function (TemporaryTokenAliasMedia) {
    TemporaryTokenAliasMedia["Json"] = "json";
    TemporaryTokenAliasMedia["QR"] = "qr";
})(TemporaryTokenAliasMedia = exports.TemporaryTokenAliasMedia || (exports.TemporaryTokenAliasMedia = {}));
var TemporaryTokenAlias = /** @class */ (function (_super) {
    tslib_1.__extends(TemporaryTokenAlias, _super);
    function TemporaryTokenAlias() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TemporaryTokenAlias.prototype.create = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.POST, '/tokens/alias', TemporaryTokenAlias.requiredParams)(data, callback);
    };
    TemporaryTokenAlias.prototype.get = function (storeId, id, data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, this._routeBase + "/:id", undefined, undefined, data && data.media === TemporaryTokenAliasMedia.QR ? 'image/png' : undefined)(data, callback, ['storeId', 'id'], storeId, id);
    };
    TemporaryTokenAlias.prototype.delete = function (storeId, id, data, callback) {
        return this._deleteRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    TemporaryTokenAlias.requiredParams = ['transactionTokenId'];
    TemporaryTokenAlias.routeBase = '/stores/:storeId/tokens/alias';
    return TemporaryTokenAlias;
}(CRUDResource_1.CRUDResource));
exports.TemporaryTokenAlias = TemporaryTokenAlias;
//# sourceMappingURL=TemporaryTokenAlias.js.map