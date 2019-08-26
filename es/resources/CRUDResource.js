import * as tslib_1 from "tslib";
/**
 *  @internal
 *  @module Resources
 */
import { HTTPMethod } from '../api/RestAPI';
import { Resource } from './Resource';
export var CursorDirection;
(function (CursorDirection) {
    CursorDirection["ASC"] = "asc";
    CursorDirection["DESC"] = "desc";
})(CursorDirection || (CursorDirection = {}));
var CRUDResource = /** @class */ (function (_super) {
    tslib_1.__extends(CRUDResource, _super);
    function CRUDResource(api) {
        var _this = _super.call(this, api) || this;
        _this._routeBase = _this.constructor.routeBase;
        return _this;
    }
    CRUDResource.prototype._listRoute = function (required) {
        return this.defineRoute(HTTPMethod.GET, this._routeBase, required);
    };
    CRUDResource.prototype._createRoute = function (required) {
        return this.defineRoute(HTTPMethod.POST, this._routeBase, required);
    };
    CRUDResource.prototype._getRoute = function (required) {
        return this.defineRoute(HTTPMethod.GET, this._routeBase + "/:id", required);
    };
    CRUDResource.prototype._updateRoute = function (required) {
        return this.defineRoute(HTTPMethod.PATCH, this._routeBase + "/:id", required);
    };
    CRUDResource.prototype._deleteRoute = function (required) {
        return this.defineRoute(HTTPMethod.DELETE, this._routeBase + "/:id", required);
    };
    return CRUDResource;
}(Resource));
export { CRUDResource };
//# sourceMappingURL=CRUDResource.js.map