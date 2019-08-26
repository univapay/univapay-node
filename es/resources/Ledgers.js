/**
 *  @module Resources/Ledgers
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
export var LedgerOrigin;
(function (LedgerOrigin) {
    LedgerOrigin["CHARGE"] = "charge";
    LedgerOrigin["REFUND"] = "refund";
    LedgerOrigin["MANUAL"] = "manual";
})(LedgerOrigin || (LedgerOrigin = {}));
var Ledgers = /** @class */ (function (_super) {
    tslib_1.__extends(Ledgers, _super);
    function Ledgers() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Ledgers.prototype.list = function (transferId, data, callback) {
        return this._listRoute()(data, callback, ['transferId'], transferId);
    };
    Ledgers.prototype.get = function (id, data, callback) {
        return this.defineRoute(HTTPMethod.GET, '/ledgers/:id')(data, callback, ['id'], id);
    };
    Ledgers.routeBase = '/transfers/:transferId/ledgers';
    return Ledgers;
}(CRUDResource));
export { Ledgers };
//# sourceMappingURL=Ledgers.js.map