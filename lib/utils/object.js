"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
function transformKeys(obj, transformer, ignoreKeys) {
    if (ignoreKeys === void 0) { ignoreKeys = []; }
    return Object.keys(obj || {}).reduce(function (r, k) {
        var _a;
        var c = function (o) { return typeof o === 'object' && Boolean(o); };
        var v = obj[k];
        if (ignoreKeys.includes(k)) {
            return tslib_1.__assign({}, r, (_a = {}, _a[k] = v, _a));
        }
        if (c(v)) {
            if (Array.isArray(v)) {
                v = v.map(function (i) { return (c(i) ? transformKeys(i, transformer) : i); });
            }
            else {
                v = transformKeys(v, transformer);
            }
        }
        r[transformer(k)] = v;
        return r;
    }, {});
}
exports.transformKeys = transformKeys;
function missingKeys(obj, keys) {
    var e_1, _a;
    if (keys === void 0) { keys = []; }
    if (!obj) {
        return keys;
    }
    var objKeys = Object.keys(obj);
    var missing = [];
    try {
        for (var keys_1 = tslib_1.__values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            if (objKeys.indexOf(key) === -1 || obj[key] === undefined) {
                missing.push(key);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return missing;
}
exports.missingKeys = missingKeys;
function omit(obj, keys) {
    return Object.keys(obj || {}).reduce(function (acc, key) {
        var _a;
        return keys.indexOf(key) === -1 ? tslib_1.__assign({}, acc, (_a = {}, _a[key] = obj[key], _a)) : acc;
    }, {});
}
exports.omit = omit;
//# sourceMappingURL=object.js.map