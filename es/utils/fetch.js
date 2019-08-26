/**
 *  @internal
 *  @module Utils
 */
import * as tslib_1 from "tslib";
import camelCase from 'camelcase';
import { APIError } from '../errors/APIError';
import { transformKeys } from './object';
export function parseJSON(response, ignoreKeys) {
    if (ignoreKeys === void 0) { ignoreKeys = ['metadata']; }
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var text;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, response.text()];
                case 1:
                    text = _a.sent();
                    return [2 /*return*/, text ? transformKeys(JSON.parse(text), camelCase, ignoreKeys) : {}];
            }
        });
    });
}
export function checkStatus(response) {
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
                    throw new APIError(response.status, json);
            }
        });
    });
}
//# sourceMappingURL=fetch.js.map