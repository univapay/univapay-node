/**
 *  @module Errors
 */
import * as tslib_1 from "tslib";
var JWTError = /** @class */ (function (_super) {
    tslib_1.__extends(JWTError, _super);
    function JWTError() {
        var _this = _super.call(this, 'Invalid JSON Web Token') || this;
        Object.setPrototypeOf(_this, JWTError.prototype);
        return _this;
    }
    return JWTError;
}(Error));
export { JWTError };
//# sourceMappingURL=JWTError.js.map