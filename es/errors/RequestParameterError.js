/**
 *  @module Errors
 */
import * as tslib_1 from "tslib";
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
export { RequestParameterError };
//# sourceMappingURL=RequestParameterError.js.map