/**
 *  @module Errors
 */
import * as tslib_1 from "tslib";
var TimeoutError = /** @class */ (function (_super) {
    tslib_1.__extends(TimeoutError, _super);
    function TimeoutError(timeout) {
        var _this = _super.call(this, "Timed out after " + timeout + " milliseconds.") || this;
        _this.timeout = timeout;
        _this.name = 'TimeoutError';
        Object.setPrototypeOf(_this, TimeoutError.prototype);
        return _this;
    }
    return TimeoutError;
}(Error));
export { TimeoutError };
//# sourceMappingURL=TimeoutError.js.map