/**
 *  @module Resources/Subscriptions
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
import { ignoreDescriptor } from './common/ignoreDescriptor';
export var SubscriptionPeriod;
(function (SubscriptionPeriod) {
    SubscriptionPeriod["DAILY"] = "daily";
    SubscriptionPeriod["WEEKLY"] = "weekly";
    SubscriptionPeriod["BIWEEKLY"] = "biweekly";
    SubscriptionPeriod["MONTHLY"] = "monthly";
    SubscriptionPeriod["QUARTERLY"] = "quarterly";
    SubscriptionPeriod["SEMIANNUALLY"] = "semiannually";
    SubscriptionPeriod["ANNUALLY"] = "annually";
})(SubscriptionPeriod || (SubscriptionPeriod = {}));
export var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["UNVERIFIED"] = "unverified";
    SubscriptionStatus["CURRENT"] = "current";
    SubscriptionStatus["SUSPENDED"] = "suspended";
    SubscriptionStatus["UNPAID"] = "unpaid";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["UNCONFIRMED"] = "unconfirmed";
    SubscriptionStatus["COMPLETED"] = "completed";
})(SubscriptionStatus || (SubscriptionStatus = {}));
export var InstallmentPlan;
(function (InstallmentPlan) {
    InstallmentPlan["REVOLVING"] = "revolving";
    InstallmentPlan["FIXED_CYCLES"] = "fixed_cycles";
    InstallmentPlan["FIXED_CYCLE_AMOUNT"] = "fixed_cycle_amount";
})(InstallmentPlan || (InstallmentPlan = {}));
var ScheduledPayments = /** @class */ (function (_super) {
    tslib_1.__extends(ScheduledPayments, _super);
    function ScheduledPayments() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ScheduledPayments.prototype.list = function (storeId, subscriptionsId, data, callback) {
        return this.defineRoute(HTTPMethod.GET, "" + ScheduledPayments.routeBase)(data, callback, ['storeId', 'subscriptionsId'], storeId, subscriptionsId);
    };
    ScheduledPayments.prototype.get = function (storeId, subscriptionsId, id, data, callback) {
        return this._getRoute()(data, callback, ['storeId', 'subscriptionsId', 'id'], storeId, subscriptionsId, id);
    };
    ScheduledPayments.prototype.update = function (storeId, subscriptionsId, id, data, callback) {
        return this._updateRoute()(data, callback, ['storeId', 'subscriptionsId', 'id'], storeId, subscriptionsId, id);
    };
    ScheduledPayments.prototype.listCharges = function (storeId, subscriptionsId, paymentId, data, callback) {
        return this.defineRoute(HTTPMethod.GET, ScheduledPayments.routeBase + "/:paymentId/charges")(data, callback, ['storeId', 'subscriptionsId', 'paymentId'], storeId, subscriptionsId, paymentId);
    };
    ScheduledPayments.routeBase = '/stores/:storeId/subscriptions/:subscriptionsId/payments';
    return ScheduledPayments;
}(CRUDResource));
export { ScheduledPayments };
var Subscriptions = /** @class */ (function (_super) {
    tslib_1.__extends(Subscriptions, _super);
    function Subscriptions(api) {
        var _this = _super.call(this, api) || this;
        _this.payments = new ScheduledPayments(api);
        return _this;
    }
    Subscriptions.prototype.list = function (data, callback, storeId) {
        return this.defineRoute(HTTPMethod.GET, '(/stores/:storeId)/subscriptions')(data, callback, ['storeId'], storeId);
    };
    Subscriptions.prototype.create = function (data, callback) {
        var _this = this;
        return ignoreDescriptor(function (updatedData) {
            return _this.defineRoute(HTTPMethod.POST, '/subscriptions', Subscriptions.requiredParams)(updatedData, callback);
        }, data);
    };
    Subscriptions.prototype.get = function (storeId, id, data, callback) {
        return this._getRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    Subscriptions.prototype.update = function (storeId, id, data, callback) {
        return this._updateRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    Subscriptions.prototype.delete = function (storeId, id, data, callback) {
        return this._deleteRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    Subscriptions.prototype.charges = function (storeId, id, data, callback) {
        return this.defineRoute(HTTPMethod.GET, Subscriptions.routeBase + "/:id/charges")(data, callback, ['storeId', 'id'], storeId, id);
    };
    Subscriptions.prototype.poll = function (storeId, id, data, callback) {
        var _this = this;
        var promise = function () {
            return _this.get(storeId, id, tslib_1.__assign({}, data, { polling: true }));
        };
        return this.api.longPolling(promise, function (response) { return response.status !== SubscriptionStatus.UNVERIFIED; }, callback);
    };
    Subscriptions.prototype.simulation = function (data, callback, storeId) {
        return this.defineRoute(HTTPMethod.POST, '(/stores/:storeId)/subscriptions/simulate_plan', Subscriptions.requiredSimulationParams)(data, callback, ['storeId'], storeId);
    };
    Subscriptions.requiredParams = ['transactionTokenId', 'amount', 'currency', 'period'];
    Subscriptions.requiredSimulationParams = ['installmentPlan', 'paymentType', 'currency', 'period'];
    Subscriptions.routeBase = '/stores/:storeId/subscriptions';
    return Subscriptions;
}(CRUDResource));
export { Subscriptions };
//# sourceMappingURL=Subscriptions.js.map