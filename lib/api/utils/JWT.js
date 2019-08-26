"use strict";
/**
 *  @internal
 *  @module Utils
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var jwt_decode_1 = tslib_1.__importDefault(require("jwt-decode"));
var camelcase_1 = tslib_1.__importDefault(require("camelcase"));
var JWTError_1 = require("../../errors/JWTError");
var object_1 = require("../../utils/object");
function parseJWT(jwt, keepKeys) {
    if (keepKeys === void 0) { keepKeys = false; }
    if (!jwt) {
        return null;
    }
    if (jwt.split('.').length !== 3) {
        throw new JWTError_1.JWTError();
    }
    try {
        var decoded = jwt_decode_1.default(jwt);
        return keepKeys ? decoded : object_1.transformKeys(decoded, camelcase_1.default);
    }
    catch (_a) {
        throw new JWTError_1.JWTError();
    }
}
exports.parseJWT = parseJWT;
var BearerRegexp = /^Bearer (.*)$/i;
/**
 *  @internal
 */
function extractJWT(response) {
    var headerNames = ['authorization', 'x-amzn-remapped-authorization'];
    var header = headerNames.reduce(function (acc, name) { return response.headers.get(name) || acc; }, null);
    if (header === null) {
        return null;
    }
    var matches = header.match(BearerRegexp);
    return matches === null ? null : matches[1];
}
exports.extractJWT = extractJWT;
//# sourceMappingURL=JWT.js.map