/**
 *  @module Resources/CheckoutInfo
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { Resource } from './Resource';
var CheckoutInfo = /** @class */ (function (_super) {
    tslib_1.__extends(CheckoutInfo, _super);
    function CheckoutInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckoutInfo.prototype.get = function (data, callback) {
        return this.defineRoute(HTTPMethod.GET, '/checkout_info')(data, callback);
    };
    return CheckoutInfo;
}(Resource));
export { CheckoutInfo };
//# sourceMappingURL=CheckoutInfo.js.map