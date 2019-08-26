/**
 *  @module Resources/TransactionTokens
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
export var UsageLimit;
(function (UsageLimit) {
    UsageLimit["DAILY"] = "daily";
    UsageLimit["WEEKLY"] = "weekly";
    UsageLimit["MONTHLY"] = "monthly";
    UsageLimit["YEARLY"] = "yearly";
})(UsageLimit || (UsageLimit = {}));
export var PaymentType;
(function (PaymentType) {
    PaymentType["CARD"] = "card";
    PaymentType["QR_SCAN"] = "qr_scan";
    PaymentType["KONBINI"] = "konbini";
    PaymentType["APPLE_PAY"] = "apple_pay";
    PaymentType["PAIDY"] = "paidy";
    PaymentType["QR_MERCHANT"] = "qr_merchant";
})(PaymentType || (PaymentType = {}));
export var ConvenienceStore;
(function (ConvenienceStore) {
    ConvenienceStore["SEVEN_ELEVEN"] = "seven_eleven";
    ConvenienceStore["FAMILY_MART"] = "family_mart";
    ConvenienceStore["LAWSON"] = "lawson";
    ConvenienceStore["MINI_STOP"] = "mini_stop";
    ConvenienceStore["SEICO_MART"] = "seico_mart";
    ConvenienceStore["PAY_EASY"] = "pay_easy";
    ConvenienceStore["CIRCLE_K"] = "circle_k";
    ConvenienceStore["SUNKUS"] = "sunkus";
    ConvenienceStore["DAILY_YAMAZAKI"] = "daily_yamazaki";
    ConvenienceStore["YAMAZAKI_DAILY_STORE"] = "yamazaki_daily_store";
})(ConvenienceStore || (ConvenienceStore = {}));
export var TransactionTokenType;
(function (TransactionTokenType) {
    TransactionTokenType["ONE_TIME"] = "one_time";
    TransactionTokenType["SUBSCRIPTION"] = "subscription";
    TransactionTokenType["RECURRING"] = "recurring";
})(TransactionTokenType || (TransactionTokenType = {}));
export var RecurringTokenPrivilege;
(function (RecurringTokenPrivilege) {
    RecurringTokenPrivilege["NONE"] = "none";
    RecurringTokenPrivilege["BOUNDED"] = "bounded";
    RecurringTokenPrivilege["INFINITE"] = "infinite";
})(RecurringTokenPrivilege || (RecurringTokenPrivilege = {}));
var TransactionTokens = /** @class */ (function (_super) {
    tslib_1.__extends(TransactionTokens, _super);
    function TransactionTokens() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TransactionTokens.prototype.create = function (data, callback) {
        return this.defineRoute(HTTPMethod.POST, '/tokens', TransactionTokens.requiredParams)(data, callback);
    };
    TransactionTokens.prototype.get = function (storeId, id, data, callback) {
        return this._getRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    TransactionTokens.prototype.list = function (data, callback, storeId) {
        return this.defineRoute(HTTPMethod.GET, '(/stores/:storeId)/tokens')(data, callback, ['storeId'], storeId);
    };
    TransactionTokens.prototype.update = function (storeId, id, data, callback) {
        return this._updateRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    TransactionTokens.prototype.delete = function (storeId, id, data, callback) {
        return this._deleteRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    TransactionTokens.prototype.confirm = function (storeId, id, data, callback) {
        return this.defineRoute(HTTPMethod.POST, '/stores/:storeId/tokens/:id/confirm')(data, callback, ['storeId', 'id'], storeId, id);
    };
    TransactionTokens.requiredParams = ['paymentType', 'type', 'data'];
    TransactionTokens.routeBase = '/stores/:storeId/tokens';
    return TransactionTokens;
}(CRUDResource));
export { TransactionTokens };
//# sourceMappingURL=TransactionTokens.js.map