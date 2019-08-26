"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PathParameterError_1 = require("../errors/PathParameterError");
var RequestParameterError_1 = require("../errors/RequestParameterError");
var parser_1 = require("../errors/parser");
var object_1 = require("../utils/object");
function compilePath(path, pathParams) {
    return path
        .replace(/\((\w|:|\/)+\)/gi, function (o) {
        var part = o.replace(/:(\w+)/gi, function (s, p) {
            return pathParams[p] || s;
        });
        return part.indexOf(':') === -1 ? part.replace(/\(|\)/g, '') : '';
    })
        .replace(/:(\w+)/gi, function (s, p) { return pathParams[p] || s; });
}
var Resource = /** @class */ (function () {
    function Resource(api) {
        this.api = api;
    }
    Resource.prototype.defineRoute = function (method, path, required, requireAuth, acceptType) {
        if (required === void 0) { required = []; }
        if (requireAuth === void 0) { requireAuth = true; }
        var api = this.api;
        return function route(data, callback, pathParams) {
            if (pathParams === void 0) { pathParams = []; }
            var params = [];
            for (var _i = 3; _i < arguments.length; _i++) {
                params[_i - 3] = arguments[_i];
            }
            var _params = params.reduce(function (p, param, i) {
                if (pathParams && pathParams[i]) {
                    p[pathParams[i]] = param;
                }
                return p;
            }, {});
            var url = compilePath(path, _params);
            var missingPathParams = (url.match(/:([a-z]+)/gi) || []).map(function (m) { return m.replace(':', ''); });
            var missingParams = object_1.missingKeys(data, required);
            var err;
            if (missingPathParams.length > 0) {
                err = parser_1.fromError(new PathParameterError_1.PathParameterError(missingPathParams[0]));
                if (typeof callback === 'function') {
                    callback(err);
                }
                return Promise.reject(err);
            }
            if (missingParams.length > 0) {
                err = parser_1.fromError(new RequestParameterError_1.RequestParameterError(missingParams[0]));
                if (typeof callback === 'function') {
                    callback(err);
                }
                return Promise.reject(err);
            }
            return api.send(method, url, data, callback, requireAuth, acceptType);
        };
    };
    return Resource;
}());
exports.Resource = Resource;
//# sourceMappingURL=Resource.js.map