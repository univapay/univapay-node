"use strict";
/**
 *  @module Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=TimeoutError.js.map