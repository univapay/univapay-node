"use strict";
/**
 *  @internal
 *  @module Utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var camelcase_1 = tslib_1.__importDefault(require("camelcase"));
var APIError_1 = require("../errors/APIError");
var object_1 = require("./object");
function parseJSON(response, ignoreKeys) {
    if (ignoreKeys === void 0) { ignoreKeys = ['metadata']; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var text;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, response.text()];
                case 1:
                    text = _a.sent();
                    return [2 /*return*/, text ? object_1.transformKeys(JSON.parse(text), camelcase_1.default, ignoreKeys) : {}];
            }
        });
    });
}
exports.parseJSON = parseJSON;
function checkStatus(response) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var json;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (response.status >= 200 && response.status < 400) {
                        return [2 /*return*/, response];
                    }
                    return [4 /*yield*/, parseJSON(response)];
                case 1:
                    json = _a.sent();
                    throw new APIError_1.APIError(response.status, json);
            }
        });
    });
}
exports.checkStatus = checkStatus;
//# sourceMappingURL=fetch.js.map