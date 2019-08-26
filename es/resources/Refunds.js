/**
 *  @module Resources/Refunds
 */
import * as tslib_1 from "tslib";
import { CRUDResource } from './CRUDResource';
export var RefundStatus;
(function (RefundStatus) {
    RefundStatus["PENDING"] = "pending";
    RefundStatus["SUCCESSFUL"] = "successful";
    RefundStatus["FAILED"] = "failed";
    RefundStatus["ERROR"] = "error";
})(RefundStatus || (RefundStatus = {}));
export var RefundReason;
(function (RefundReason) {
    RefundReason["DUPLICATE"] = "duplicate";
    RefundReason["FRAUD"] = "fraud";
    RefundReason["CUSTOMER_REQUEST"] = "customer_request";
    RefundReason["CHARGEBACK"] = "chargeback";
})(RefundReason || (RefundReason = {}));
var Refunds = /** @class */ (function (_super) {
    tslib_1.__extends(Refunds, _super);
    function Refunds() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Refunds.prototype.list = function (storeId, chargeId, data, callback) {
        return this._listRoute()(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    };
    Refunds.prototype.create = function (storeId, chargeId, data, callback) {
        return this._createRoute(Refunds.requiredParams)(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    };
    Refunds.prototype.get = function (storeId, chargeId, id, data, callback) {
        return this._getRoute()(data, callback, ['storeId', 'chargeId', 'id'], storeId, chargeId, id);
    };
    Refunds.prototype.update = function (storeId, chargeId, id, data, callback) {
        return this._updateRoute()(data, callback, ['storeId', 'chargeId', 'id'], storeId, chargeId, id);
    };
    Refunds.prototype.poll = function (storeId, chargeId, id, data, callback) {
        var _this = this;
        var promise = function () {
            return _this.get(storeId, chargeId, id, tslib_1.__assign({}, data, { polling: true }));
        };
        return this.api.longPolling(promise, function (response) { return response.status !== RefundStatus.PENDING; }, callback);
    };
    Refunds.requiredParams = ['amount', 'currency'];
    Refunds.routeBase = '/stores/:storeId/charges/:chargeId/refunds';
    return Refunds;
}(CRUDResource));
export { Refunds };
//# sourceMappingURL=Refunds.js.map