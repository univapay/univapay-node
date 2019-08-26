"use strict";
/**
 *  @module Resources/Merchants
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var CRUDResource_1 = require("./CRUDResource");
var Merchants = /** @class */ (function (_super) {
    tslib_1.__extends(Merchants, _super);
    function Merchants() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Merchants.prototype.me = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, '/me')(data, callback);
    };
    return Merchants;
}(CRUDResource_1.CRUDResource));
exports.Merchants = Merchants;
//# sourceMappingURL=Merchants.js.map