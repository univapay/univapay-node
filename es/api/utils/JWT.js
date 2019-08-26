/**
 *  @internal
 *  @module Utils
 */
import jwtDecode from 'jwt-decode';
import camelCase from 'camelcase';
import { JWTError } from '../../errors/JWTError';
import { transformKeys } from '../../utils/object';
export function parseJWT(jwt, keepKeys) {
    if (keepKeys === void 0) { keepKeys = false; }
    if (!jwt) {
        return null;
    }
    if (jwt.split('.').length !== 3) {
        throw new JWTError();
    }
    try {
        var decoded = jwtDecode(jwt);
        return keepKeys ? decoded : transformKeys(decoded, camelCase);
    }
    catch (_a) {
        throw new JWTError();
    }
}
var BearerRegexp = /^Bearer (.*)$/i;
/**
 *  @internal
 */
export function extractJWT(response) {
    var headerNames = ['authorization', 'x-amzn-remapped-authorization'];
    var header = headerNames.reduce(function (acc, name) { return response.headers.get(name) || acc; }, null);
    if (header === null) {
        return null;
    }
    var matches = header.match(BearerRegexp);
    return matches === null ? null : matches[1];
}
//# sourceMappingURL=JWT.js.map