/**
 *  @module Resources/Transfers
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
export var TransferStatus;
(function (TransferStatus) {
    TransferStatus["CREATED"] = "created";
    TransferStatus["APPROVED"] = "approved";
    TransferStatus["CANCELED"] = "canceled";
    TransferStatus["PROCESSING"] = "processing";
    TransferStatus["PAID"] = "paid";
    TransferStatus["FAILED"] = "failed";
    TransferStatus["BLANK"] = "blank";
})(TransferStatus || (TransferStatus = {}));
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
        return this.defineRoute(HTTPMethod.GET, Transfers.routeBase + "/:id/status_changes")(data, callback, ['id'], id);
    };
    Transfers.routeBase = '/transfers';
    return Transfers;
}(CRUDResource));
export { Transfers };
//# sourceMappingURL=Transfers.js.map