"use strict";
/**
 *  @module Resources/BankAccounts
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var CRUDResource_1 = require("./CRUDResource");
var BankAccountStatus;
(function (BankAccountStatus) {
    BankAccountStatus["NEW"] = "new";
    BankAccountStatus["UNABLE_TO_VERIFY"] = "unable_to_verify";
    BankAccountStatus["VERIFIED"] = "verified";
    BankAccountStatus["ERRORED"] = "errored";
})(BankAccountStatus = exports.BankAccountStatus || (exports.BankAccountStatus = {}));
var BankAccountType;
(function (BankAccountType) {
    BankAccountType["CHECKING"] = "checking";
    BankAccountType["SAVINGS"] = "savings";
})(BankAccountType = exports.BankAccountType || (exports.BankAccountType = {}));
var BankAccounts = /** @class */ (function (_super) {
    tslib_1.__extends(BankAccounts, _super);
    function BankAccounts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BankAccounts.prototype.list = function (data, callback) {
        return this._listRoute()(data, callback);
    };
    BankAccounts.prototype.create = function (data, callback) {
        return this._createRoute(BankAccounts.requiredParams)(data, callback);
    };
    BankAccounts.prototype.get = function (id, data, callback) {
        return this._getRoute()(data, callback, ['id'], id);
    };
    BankAccounts.prototype.update = function (id, data, callback) {
        return this._updateRoute()(data, callback, ['id'], id);
    };
    BankAccounts.prototype.delete = function (id, data, callback) {
        return this._deleteRoute()(data, callback, ['id'], id);
    };
    BankAccounts.prototype.getPrimary = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, this._routeBase + "/primary")(data, callback);
    };
    BankAccounts.requiredParams = ['accountNumber', 'country', 'currency', 'holderName', 'bankName'];
    BankAccounts.routeBase = '/bank_accounts';
    return BankAccounts;
}(CRUDResource_1.CRUDResource));
exports.BankAccounts = BankAccounts;
//# sourceMappingURL=BankAccounts.js.map