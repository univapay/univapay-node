/**
 *  @module Resources/Stores
 */
import * as tslib_1 from "tslib";
import { CRUDResource } from './CRUDResource';
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
}(CRUDResource));
export { Stores };
//# sourceMappingURL=Stores.js.map