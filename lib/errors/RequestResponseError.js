"use strict";
/**
 *  @module Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var RequestResponseBaseError = /** @class */ (function (_super) {
    tslib_1.__extends(RequestResponseBaseError, _super);
    function RequestResponseBaseError(errorResponse) {
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, RequestResponseBaseError.prototype);
        _this.errorResponse = tslib_1.__assign({ status: 'error' }, errorResponse);
        return _this;
    }
    return RequestResponseBaseError;
}(Error));
exports.RequestResponseBaseError = RequestResponseBaseError;
var RequestError = /** @class */ (function (_super) {
    tslib_1.__extends(RequestError, _super);
    function RequestError(errorResponse) {
        var _this = _super.call(this, errorResponse) || this;
        Object.setPrototypeOf(_this, RequestError.prototype);
        return _this;
    }
    return RequestError;
}(RequestResponseBaseError));
exports.RequestError = RequestError;
var ResponseError = /** @class */ (function (_super) {
    tslib_1.__extends(ResponseError, _super);
    function ResponseError(errorResponse) {
        var _this = _super.call(this, errorResponse) || this;
        Object.setPrototypeOf(_this, ResponseError.prototype);
        return _this;
    }
    return ResponseError;
}(RequestResponseBaseError));
exports.ResponseError = ResponseError;
//# sourceMappingURL=RequestResponseError.js.map