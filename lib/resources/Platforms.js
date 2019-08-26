"use strict";
/**
 *  @module Resources/Platforms
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RestAPI_1 = require("../api/RestAPI");
var CRUDResource_1 = require("./CRUDResource");
var Platforms = /** @class */ (function (_super) {
    tslib_1.__extends(Platforms, _super);
    function Platforms() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Platforms.prototype.getConfiguration = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, '/platform', undefined, false)(data, callback);
    };
    return Platforms;
}(CRUDResource_1.CRUDResource));
exports.Platforms = Platforms;
//# sourceMappingURL=Platforms.js.map