"use strict";
/**
 *  @module Resources/Charges
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var CRUDResource_1 = require("./CRUDResource");
var ignoreDescriptor_1 = require("./common/ignoreDescriptor");
var ChargeStatus;
(function (ChargeStatus) {
    ChargeStatus["PENDING"] = "pending";
    ChargeStatus["SUCCESSFUL"] = "successful";
    ChargeStatus["FAILED"] = "failed";
    ChargeStatus["ERROR"] = "error";
    ChargeStatus["CANCELED"] = "canceled";
    ChargeStatus["AWAITING"] = "awaiting";
    ChargeStatus["AUTHORIZED"] = "authorized";
})(ChargeStatus = exports.ChargeStatus || (exports.ChargeStatus = {}));
var Charges = /** @class */ (function (_super) {
    tslib_1.__extends(Charges, _super);
    function Charges() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Charges.prototype.list = function (data, callback, storeId) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, '(/stores/:storeId)/charges')(data, callback, ['storeId'], storeId);
    };
    Charges.prototype.create = function (data, callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, ignoreDescriptor_1.ignoreDescriptor(function (updatedData) {
                            return _this.defineRoute(RestAPI_1.HTTPMethod.POST, '/charges', Charges.requiredParams)(updatedData, callback);
                        }, data)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Charges.prototype.get = function (storeId, id, data, callback) {
        return this._getRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    Charges.prototype.poll = function (storeId, id, data, callback) {
        var _this = this;
        var promise = function () {
            return _this.get(storeId, id, tslib_1.__assign({}, data, { polling: true }));
        };
        return this.api.longPolling(promise, function (response) { return response.status !== ChargeStatus.PENDING; }, callback);
    };
    Charges.requiredParams = ['transactionTokenId', 'amount', 'currency'];
    Charges.routeBase = '/stores/:storeId/charges';
    return Charges;
}(CRUDResource_1.CRUDResource));
exports.Charges = Charges;
//# sourceMappingURL=Charges.js.map