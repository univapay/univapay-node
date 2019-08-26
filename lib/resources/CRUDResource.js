"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 *  @internal
 *  @module Resources
 */
var RestAPI_1 = require("../api/RestAPI");
var Resource_1 = require("./Resource");
var CursorDirection;
(function (CursorDirection) {
    CursorDirection["ASC"] = "asc";
    CursorDirection["DESC"] = "desc";
})(CursorDirection = exports.CursorDirection || (exports.CursorDirection = {}));
var CRUDResource = /** @class */ (function (_super) {
    tslib_1.__extends(CRUDResource, _super);
    function CRUDResource(api) {
        var _this = _super.call(this, api) || this;
        _this._routeBase = _this.constructor.routeBase;
        return _this;
    }
    CRUDResource.prototype._listRoute = function (required) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, this._routeBase, required);
    };
    CRUDResource.prototype._createRoute = function (required) {
        return this.defineRoute(RestAPI_1.HTTPMethod.POST, this._routeBase, required);
    };
    CRUDResource.prototype._getRoute = function (required) {
        return this.defineRoute(RestAPI_1.HTTPMethod.GET, this._routeBase + "/:id", required);
    };
    CRUDResource.prototype._updateRoute = function (required) {
        return this.defineRoute(RestAPI_1.HTTPMethod.PATCH, this._routeBase + "/:id", required);
    };
    CRUDResource.prototype._deleteRoute = function (required) {
        return this.defineRoute(RestAPI_1.HTTPMethod.DELETE, this._routeBase + "/:id", required);
    };
    return CRUDResource;
}(Resource_1.Resource));
exports.CRUDResource = CRUDResource;
//# sourceMappingURL=CRUDResource.js.map