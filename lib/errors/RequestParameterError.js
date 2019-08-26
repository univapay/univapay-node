"use strict";
/**
 *  @module Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RequestParameterError = /** @class */ (function (_super) {
    tslib_1.__extends(RequestParameterError, _super);
    function RequestParameterError(parameter) {
        var _this = _super.call(this) || this;
        _this.parameter = parameter;
        Object.setPrototypeOf(_this, RequestParameterError.prototype);
        return _this;
    }
    return RequestParameterError;
}(Error));
exports.RequestParameterError = RequestParameterError;
//# sourceMappingURL=RequestParameterError.js.map