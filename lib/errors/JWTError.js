"use strict";
/**
 *  @module Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var JWTError = /** @class */ (function (_super) {
    tslib_1.__extends(JWTError, _super);
    function JWTError() {
        var _this = _super.call(this, 'Invalid JSON Web Token') || this;
        Object.setPrototypeOf(_this, JWTError.prototype);
        return _this;
    }
    return JWTError;
}(Error));
exports.JWTError = JWTError;
//# sourceMappingURL=JWTError.js.map