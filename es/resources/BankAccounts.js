/**
 *  @module Resources/BankAccounts
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
export var BankAccountStatus;
(function (BankAccountStatus) {
    BankAccountStatus["NEW"] = "new";
    BankAccountStatus["UNABLE_TO_VERIFY"] = "unable_to_verify";
    BankAccountStatus["VERIFIED"] = "verified";
    BankAccountStatus["ERRORED"] = "errored";
})(BankAccountStatus || (BankAccountStatus = {}));
export var BankAccountType;
(function (BankAccountType) {
    BankAccountType["CHECKING"] = "checking";
    BankAccountType["SAVINGS"] = "savings";
})(BankAccountType || (BankAccountType = {}));
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
        return this.defineRoute(HTTPMethod.GET, this._routeBase + "/primary")(data, callback);
    };
    BankAccounts.requiredParams = ['accountNumber', 'country', 'currency', 'holderName', 'bankName'];
    BankAccounts.routeBase = '/bank_accounts';
    return BankAccounts;
}(CRUDResource));
export { BankAccounts };
//# sourceMappingURL=BankAccounts.js.map