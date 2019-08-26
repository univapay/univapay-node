"use strict";
/**
 *  @module Resources/Transfers
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var CRUDResource_1 = require("./CRUDResource");
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["CREATED"] = "created";
    TransferStatus["APPROVED"] = "approved";
    TransferStatus["CANCELED"] = "canceled";
    TransferStatus["PROCESSING"] = "processing";
    TransferStatus["PAID"] = "paid";
    TransferStatus["FAILED"] = "failed";
    TransferStatus["BLANK"] = "blank";
})(TransferStatus = exports.TransferStatus || (exports.TransferStatus = {}));
var Transfers = /** @class */ (function (_super) {
    tslib_1.__extends(Transfers, _super);
    function Transfers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Transfers.prototype.list = function (data, callback) {
        return this._listRoute()(data, callback);
    };
    Transfers.prototype.get = function (id, data, callback) {
        return this._getRoute()(data, callback, ['id'], id);
    };
    Transfers.prototype.statusChanges = function (id, data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, Transfers.routeBase + "/:id/status_changes")(data, callback, ['id'], id);
    };
    Transfers.routeBase = '/transfers';
    return Transfers;
}(CRUDResource_1.CRUDResource));
exports.Transfers = Transfers;
//# sourceMappingURL=Transfers.js.map