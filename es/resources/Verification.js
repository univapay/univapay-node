/**
 *  @module Resources/Verification
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
var Verification = /** @class */ (function (_super) {
    tslib_1.__extends(Verification, _super);
    function Verification() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Verification.prototype.create = function (data, callback) {
        return this._createRoute(Verification.requiredParams)(data, callback);
    };
    Verification.prototype.get = function (data, callback) {
        return this.defineRoute(HTTPMethod.GET, this._routeBase)(data, callback);
    };
    Verification.prototype.update = function (data, callback) {
        return this.defineRoute(HTTPMethod.PATCH, this._routeBase)(data, callback);
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
}(CRUDResource));
export { Verification };
//# sourceMappingURL=Verification.js.map