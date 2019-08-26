/**
 *  @module Errors
 */
import * as tslib_1 from "tslib";
var PathParameterError = /** @class */ (function (_super) {
    tslib_1.__extends(PathParameterError, _super);
    function PathParameterError(parameter) {
        var _this = _super.call(this) || this;
        _this.parameter = parameter;
        Object.setPrototypeOf(_this, PathParameterError.prototype);
        return _this;
    }
    return PathParameterError;
}(Error));
export { PathParameterError };
//# sourceMappingURL=PathParameterError.js.map