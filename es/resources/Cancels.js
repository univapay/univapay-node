/**
 *  @module Resources/Cancels
 */
import * as tslib_1 from "tslib";
import { CRUDResource } from './CRUDResource';
export var CancelStatus;
(function (CancelStatus) {
    CancelStatus["PENDING"] = "pending";
    CancelStatus["SUCCESSFUL"] = "successful";
    CancelStatus["FAILED"] = "failed";
    CancelStatus["ERROR"] = "error";
})(CancelStatus || (CancelStatus = {}));
var Cancels = /** @class */ (function (_super) {
    tslib_1.__extends(Cancels, _super);
    function Cancels() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cancels.prototype.list = function (storeId, chargeId, data, callback) {
        return this._listRoute()(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    };
    Cancels.prototype.create = function (storeId, chargeId, data, callback) {
        return this._createRoute(Cancels.requiredParams)(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    };
    Cancels.prototype.get = function (storeId, chargeId, id, data, callback) {
        return this._getRoute()(data, callback, ['storeId', 'chargeId', 'id'], storeId, chargeId, id);
    };
    Cancels.prototype.poll = function (storeId, chargeId, id, data, callback) {
        var _this = this;
        var promise = function () {
            return _this.get(storeId, chargeId, id, tslib_1.__assign({}, data, { polling: true }));
        };
        return this.api.longPolling(promise, function (response) { return response.status !== CancelStatus.PENDING; }, callback);
    };
    Cancels.requiredParams = [];
    Cancels.routeBase = '/stores/:storeId/charges/:chargeId/cancels';
    return Cancels;
}(CRUDResource));
export { Cancels };
//# sourceMappingURL=Cancels.js.map