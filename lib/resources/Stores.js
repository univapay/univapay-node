"use strict";
/**
 *  @module Resources/Stores
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CRUDResource_1 = require("./CRUDResource");
var Stores = /** @class */ (function (_super) {
    tslib_1.__extends(Stores, _super);
    function Stores() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Stores.prototype.list = function (data, callback) {
        return this._listRoute()(data, callback);
    };
    Stores.prototype.create = function (data, callback) {
        return this._createRoute(Stores.requiredParams)(data, callback);
    };
    Stores.prototype.get = function (id, data, callback) {
        return this._getRoute()(data, callback, ['id'], id);
    };
    Stores.prototype.update = function (id, data, callback) {
        return this._updateRoute()(data, callback, ['id'], id);
    };
    Stores.prototype.delete = function (id, data, callback) {
        return this._deleteRoute()(data, callback, ['id'], id);
    };
    Stores.requiredParams = ['name'];
    Stores.routeBase = '/stores';
    return Stores;
}(CRUDResource_1.CRUDResource));
exports.Stores = Stores;
//# sourceMappingURL=Stores.js.map