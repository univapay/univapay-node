/**
 *  @module Resources/WebHooks
 */
import * as tslib_1 from "tslib";
import { CRUDResource } from './CRUDResource';
export var WebHookTrigger;
(function (WebHookTrigger) {
    // Store
    WebHookTrigger["CHARGE_FINISHED"] = "charge_finished";
    WebHookTrigger["CHARGE_UPDATED"] = "charge_updated";
    WebHookTrigger["SUBSCRIPTION_PAYMENT"] = "subscription_payment";
    WebHookTrigger["SUBSCRIPTION_FAILURE"] = "subscription_failure";
    WebHookTrigger["SUBSCRIPTION_CANCELED"] = "subscription_canceled";
    WebHookTrigger["SUBSCRIPTION_COMPLETED"] = "subscription_completed";
    WebHookTrigger["SUBSCRIPTION_SUSPENDED"] = "subscription_suspended";
    WebHookTrigger["REFUND_FINISHED"] = "refund_finished";
    WebHookTrigger["CANCEL_FINISHED"] = "cancel_finished";
    // Merchant
    WebHookTrigger["TRANSFER_CREATED"] = "transfer_created";
    WebHookTrigger["TRANSFER_UPDATED"] = "transfer_updated";
    WebHookTrigger["TRANSFER_FINALIZED"] = "transfer_finalized";
})(WebHookTrigger || (WebHookTrigger = {}));
var WebHooks = /** @class */ (function (_super) {
    tslib_1.__extends(WebHooks, _super);
    function WebHooks() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebHooks.prototype.list = function (data, callback, storeId) {
        return this._listRoute()(data, callback, ['storeId'], storeId);
    };
    WebHooks.prototype.create = function (data, callback, storeId) {
        return this._createRoute(WebHooks.requiredParams)(data, callback, ['storeId'], storeId);
    };
    WebHooks.prototype.get = function (id, data, callback, storeId) {
        return this._getRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    WebHooks.prototype.update = function (id, data, callback, storeId) {
        return this._updateRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    WebHooks.prototype.delete = function (id, data, callback, storeId) {
        return this._deleteRoute()(data, callback, ['storeId', 'id'], storeId, id);
    };
    WebHooks.requiredParams = ['triggers', 'url'];
    WebHooks.routeBase = '(/stores/:storeId)/webhooks';
    return WebHooks;
}(CRUDResource));
export { WebHooks };
//# sourceMappingURL=WebHooks.js.map