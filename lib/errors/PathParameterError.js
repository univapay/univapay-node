"use strict";
/**
 *  @module Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
exports.PathParameterError = PathParameterError;
//# sourceMappingURL=PathParameterError.js.map