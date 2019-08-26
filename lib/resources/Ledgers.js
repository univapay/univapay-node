"use strict";
/**
 *  @module Resources/Ledgers
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var CRUDResource_1 = require("./CRUDResource");
var LedgerOrigin;
(function (LedgerOrigin) {
    LedgerOrigin["CHARGE"] = "charge";
    LedgerOrigin["REFUND"] = "refund";
    LedgerOrigin["MANUAL"] = "manual";
})(LedgerOrigin = exports.LedgerOrigin || (exports.LedgerOrigin = {}));
var Ledgers = /** @class */ (function (_super) {
    tslib_1.__extends(Ledgers, _super);
    function Ledgers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ledgers.prototype.list = function (transferId, data, callback) {
        return this._listRoute()(data, callback, ['transferId'], transferId);
    };
    Ledgers.prototype.get = function (id, data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, '/ledgers/:id')(data, callback, ['id'], id);
    };
    Ledgers.routeBase = '/transfers/:transferId/ledgers';
    return Ledgers;
}(CRUDResource_1.CRUDResource));
exports.Ledgers = Ledgers;
//# sourceMappingURL=Ledgers.js.map