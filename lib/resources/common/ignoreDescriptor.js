"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var APIError_1 = require("../../errors/APIError");
function ignoreDescriptor(callback, data) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var error_1, isDescriptorNotSupportedError, descriptor, reducedData;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, callback(data)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    error_1 = _a.sent();
                    isDescriptorNotSupportedError = error_1.errorResponse.code === APIError_1.ResponseErrorCode.ValidationError &&
                        error_1.errorResponse.errors.length === 1 &&
                        error_1.errorResponse.errors.find(function (e) { return e.field === 'descriptor' && e.reason === APIError_1.ResponseErrorCode.NotSupportedByProcessor; });
                    if (isDescriptorNotSupportedError) {
                        descriptor = data.descriptor, reducedData = tslib_1.__rest(data, ["descriptor"]);
                        return [2 /*return*/, callback(reducedData)];
                    }
                    else {
                        throw error_1;
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.ignoreDescriptor = ignoreDescriptor;
//# sourceMappingURL=ignoreDescriptor.js.map