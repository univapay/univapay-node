"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var decamelize_1 = tslib_1.__importDefault(require("decamelize"));
function isPrimitive(value) {
    return typeof value === 'object' ? value === null : typeof value !== 'function';
}
function isObject(value) {
    return value === Object(value);
}
function isClassInstance(value) {
    return typeof value === 'object' && !(value instanceof Array) && value.constructor !== Object;
}
function containsBinaryData(data) {
    if (isPrimitive(data)) {
        return false;
    }
    else if (isClassInstance(data)) {
        return true;
    }
    else if (Array.isArray(data)) {
        return data.reduce(function (result, value) { return result || containsBinaryData(value); }, false);
    }
    else if (isObject(data)) {
        return Object.keys(data).reduce(function (result, key) { return result || containsBinaryData(data[key]); }, false);
    }
    return false;
}
exports.containsBinaryData = containsBinaryData;
function objectToFormData(obj, rootName, ignoreList) {
    if (rootName === void 0) { rootName = ''; }
    if (ignoreList === void 0) { ignoreList = null; }
    var formData = new FormData();
    function isBlob(data) {
        if (isObject(data)) {
            return typeof data.size === 'number' && typeof data.type === 'string' && typeof data.slice === 'function';
        }
        return false;
    }
    function ignore(root) {
        return (Array.isArray(ignoreList) &&
            ignoreList.some(function (x) {
                return x === root;
            }));
    }
    function appendFormData(data, root) {
        if (root === void 0) { root = ''; }
        if (!ignore(root)) {
            if (isBlob(data)) {
                formData.append(decamelize_1.default(root), data);
            }
            else if (Array.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    appendFormData(data[i], root + "[" + i + "]");
                }
            }
            else if (isObject(data) && data && !Buffer.isBuffer(data)) {
                for (var key in data) {
                    if (root === '') {
                        appendFormData(data[key], key);
                    }
                    else {
                        appendFormData(data[key], root + "." + key);
                    }
                }
            }
            else {
                if (data !== null && typeof data !== 'undefined') {
                    formData.append(decamelize_1.default(root), data);
                }
            }
        }
    }
    appendFormData(obj, rootName);
    return formData;
}
exports.objectToFormData = objectToFormData;
//# sourceMappingURL=payload.js.map