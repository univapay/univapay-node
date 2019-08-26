"use strict";
/**
 *  @module Resources/Verification
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var CRUDResource_1 = require("./CRUDResource");
var Verification = /** @class */ (function (_super) {
    tslib_1.__extends(Verification, _super);
    function Verification() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Verification.prototype.create = function (data, callback) {
        return this._createRoute(Verification.requiredParams)(data, callback);
    };
    Verification.prototype.get = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, this._routeBase)(data, callback);
    };
    Verification.prototype.update = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.PATCH, this._routeBase)(data, callback);
    };
    Verification.requiredParams = [
        'homepageUrl',
        'companyDescription',
        'companyContactInfo',
        'businessType',
        'systemManagerName',
    ];
    Verification.routeBase = '/verification';
    return Verification;
}(CRUDResource_1.CRUDResource));
exports.Verification = Verification;
//# sourceMappingURL=Verification.js.map