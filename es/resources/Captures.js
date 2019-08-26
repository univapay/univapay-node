/**
 *  @module Resources/Captures
 */
import * as tslib_1 from "tslib";
import { CRUDResource } from './CRUDResource';
/* Request */
export var CaptureStatus;
(function (CaptureStatus) {
    CaptureStatus["Authorized"] = "authorized";
    CaptureStatus["Captured"] = "captured";
    CaptureStatus["NotAuthorized"] = "not_authorized";
})(CaptureStatus || (CaptureStatus = {}));
/* Response */
var Captures = /** @class */ (function (_super) {
    tslib_1.__extends(Captures, _super);
    function Captures() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Captures.prototype.create = function (storeId, chargeId, data, callback) {
        return this._createRoute(Captures.requiredParams)(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    };
    Captures.requiredParams = ['amount', 'currency'];
    Captures.routeBase = '/stores/:storeId/charges/:chargeId/capture';
    return Captures;
}(CRUDResource));
export { Captures };
//# sourceMappingURL=Captures.js.map