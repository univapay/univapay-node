"use strict";
/**
 *  @module Resources/Captures
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var CRUDResource_1 = require("./CRUDResource");
/* Request */
var CaptureStatus;
(function (CaptureStatus) {
    CaptureStatus["Authorized"] = "authorized";
    CaptureStatus["Captured"] = "captured";
    CaptureStatus["NotAuthorized"] = "not_authorized";
})(CaptureStatus = exports.CaptureStatus || (exports.CaptureStatus = {}));
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
}(CRUDResource_1.CRUDResource));
exports.Captures = Captures;
//# sourceMappingURL=Captures.js.map