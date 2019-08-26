"use strict";
/**
 *  @module Resources/CheckoutInfo
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var Resource_1 = require("./Resource");
var CheckoutInfo = /** @class */ (function (_super) {
    tslib_1.__extends(CheckoutInfo, _super);
    function CheckoutInfo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckoutInfo.prototype.get = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, '/checkout_info')(data, callback);
    };
    return CheckoutInfo;
}(Resource_1.Resource));
exports.CheckoutInfo = CheckoutInfo;
//# sourceMappingURL=CheckoutInfo.js.map