"use strict";
/**
 *  @module SDK/API
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
require("isomorphic-fetch");
require("isomorphic-form-data");
var decamelize_1 = tslib_1.__importDefault(require("decamelize"));
var constants_1 = require("../common/constants");
var object_1 = require("../utils/object");
var fetch_1 = require("../utils/fetch");
var TimeoutError_1 = require("../errors/TimeoutError");
var parser_1 = require("../errors/parser");
var query_string_1 = require("query-string");
var APIError_1 = require("../errors/APIError");
var JWT_1 = require("./utils/JWT");
var RequestResponseError_1 = require("../errors/RequestResponseError");
var payload_1 = require("./utils/payload");
var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["GET"] = "GET";
    HTTPMethod["POST"] = "POST";
    HTTPMethod["PATCH"] = "PATCH";
    HTTPMethod["PUT"] = "PUT";
    HTTPMethod["DELETE"] = "DELETE";
    HTTPMethod["OPTION"] = "OPTION";
    HTTPMethod["HEAD"] = "HEAD";
})(HTTPMethod = exports.HTTPMethod || (exports.HTTPMethod = {}));
var internalParams = [
    'appId',
    'secret',
    'authToken',
    'jwt',
    'idempotentKey',
    'origin',
];
function getData(data) {
    return object_1.omit(data, internalParams);
}
function getRequestBody(data) {
    return payload_1.containsBinaryData(data) ? payload_1.objectToFormData(data) : JSON.stringify(object_1.transformKeys(data, decamelize_1.default));
}
function getIdempotencyKey(data) {
    return typeof data === 'object' && !!data ? data.idempotentKey : null;
}
function getOrigin(data) {
    return typeof data === 'object' && !!data ? data.origin : null;
}
function stringifyParams(data) {
    var query = query_string_1.stringify(object_1.transformKeys(data, decamelize_1.default), { arrayFormat: 'bracket' });
    return query ? "?" + query : '';
}
function execRequest(executor, callback) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var response, error_1, err;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, executor()];
                case 1:
                    response = _a.sent();
                    if (typeof callback === 'function') {
                        callback(response);
                    }
                    return [2 /*return*/, response];
                case 2:
                    error_1 = _a.sent();
                    err = error_1 instanceof TimeoutError_1.TimeoutError ? error_1 : parser_1.fromError(error_1);
                    if (typeof callback === 'function') {
                        callback(err);
                    }
                    throw err;
                case 3: return [2 /*return*/];
            }
        });
    });
}
var RestAPI = /** @class */ (function () {
    function RestAPI(options) {
        if (options === void 0) { options = {}; }
        this.handleUpdateJWT = function () { return undefined; };
        this._jwtRaw = null;
        this.endpoint = options.endpoint || process.env[constants_1.ENV_KEY_ENDPOINT] || constants_1.DEFAULT_ENDPOINT;
        this.origin = options.origin || this.origin;
        this.jwtRaw = options.jwt;
        if (options.handleUpdateJWT && typeof options.handleUpdateJWT === 'function') {
            this.handleUpdateJWT = options.handleUpdateJWT;
        }
        this.appId = options.appId || process.env[constants_1.ENV_KEY_APP_ID];
        this.secret = options.secret || process.env[constants_1.ENV_KEY_SECRET];
        this.authToken = options.authToken;
    }
    Object.defineProperty(RestAPI.prototype, "jwtRaw", {
        get: function () {
            return this._jwtRaw;
        },
        set: function (jwtRaw) {
            this.jwt = JWT_1.parseJWT(jwtRaw);
            this._jwtRaw = jwtRaw;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @internal
     */
    RestAPI.prototype.send = function (method, uri, data, callback, requireAuth, acceptType) {
        if (requireAuth === void 0) { requireAuth = true; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var dateNow, timestampUTC, payload, params, requestData, request;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dateNow = new Date();
                        timestampUTC = Math.round(dateNow.getTime() / 1000);
                        if (requireAuth && this._jwtRaw && this.jwt.exp < timestampUTC) {
                            throw new RequestResponseError_1.RequestError({
                                code: APIError_1.ResponseErrorCode.ExpiredLoginToken,
                                errors: [],
                            });
                        }
                        payload = [HTTPMethod.GET, HTTPMethod.DELETE].indexOf(method) === -1;
                        params = {
                            headers: this.getHeaders(data, payload, acceptType),
                            method: method,
                        };
                        requestData = getData(data);
                        request = new Request("" + this.endpoint + uri + (payload ? '' : stringifyParams(requestData)), payload ? tslib_1.__assign({}, params, { body: getRequestBody(requestData) }) : params);
                        return [4 /*yield*/, execRequest(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                                var response, jwt, contentType;
                                return tslib_1.__generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, fetch(request)];
                                        case 1:
                                            response = _a.sent();
                                            return [4 /*yield*/, JWT_1.extractJWT(response)];
                                        case 2:
                                            jwt = _a.sent();
                                            if (jwt) {
                                                this.jwtRaw = jwt;
                                                this.handleUpdateJWT(jwt);
                                            }
                                            return [4 /*yield*/, fetch_1.checkStatus(response)];
                                        case 3:
                                            _a.sent();
                                            contentType = response.headers.get('content-type');
                                            if (!(contentType === 'application/json')) return [3 /*break*/, 5];
                                            return [4 /*yield*/, fetch_1.parseJSON(response)];
                                        case 4: return [2 /*return*/, _a.sent()];
                                        case 5:
                                            if (!contentType) return [3 /*break*/, 9];
                                            if (!(contentType.indexOf('text/') === 0)) return [3 /*break*/, 7];
                                            return [4 /*yield*/, response.text()];
                                        case 6: return [2 /*return*/, _a.sent()];
                                        case 7:
                                            if (!(contentType.indexOf('multipart/') === 0)) return [3 /*break*/, 9];
                                            return [4 /*yield*/, response.formData()];
                                        case 8: return [2 /*return*/, _a.sent()];
                                        case 9: return [4 /*yield*/, response.blob()];
                                        case 10: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); }, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RestAPI.prototype.getHeaders = function (data, payload, acceptType) {
        if (acceptType === void 0) { acceptType = 'application/json'; }
        var headers = new Headers();
        var isFormData = payload_1.containsBinaryData(data);
        headers.append('Accept', acceptType);
        if (!isFormData && payload) {
            headers.append('Content-Type', 'application/json');
        }
        var origin = getOrigin(data) || this.origin;
        if (origin) {
            headers.append('Origin', origin);
        }
        var idempotentKey = getIdempotencyKey(data);
        if (idempotentKey) {
            headers.append(constants_1.IDEMPOTENCY_KEY_HEADER, idempotentKey);
        }
        // Deprecated
        var _a = tslib_1.__assign({}, (!isFormData ? data : {})), _b = _a.authToken, authToken = _b === void 0 ? this.authToken : _b, _c = _a.appId, appId = _c === void 0 ? this.appId : _c, _d = _a.secret, secret = _d === void 0 ? this.secret : _d, _e = _a.jwt, jwt = _e === void 0 ? this._jwtRaw : _e;
        if (authToken) {
            headers.append('Authorization', "Token " + authToken);
        }
        else if (appId) {
            headers.append('Authorization', "ApplicationToken " + appId + "|" + (secret || ''));
        }
        else if (jwt) {
            if (secret) {
                headers.append('Authorization', "Bearer " + secret + "." + jwt);
            }
            else {
                headers.append('Authorization', "Bearer " + jwt);
            }
        }
        return headers;
    };
    /**
     * @internal
     */
    RestAPI.prototype.longPolling = function (promise, condition, callback, timeout) {
        if (timeout === void 0) { timeout = constants_1.POLLING_TIMEOUT; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execRequest(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
                            var timedOut;
                            return tslib_1.__generator(this, function (_a) {
                                timedOut = false;
                                return [2 /*return*/, Promise.race([
                                        // Timeout
                                        new Promise(function (_, reject) {
                                            setTimeout(function () {
                                                timedOut = true;
                                                reject(new TimeoutError_1.TimeoutError(timeout));
                                            }, timeout);
                                        }),
                                        // Repeater
                                        (function repeater() {
                                            return tslib_1.__awaiter(this, void 0, void 0, function () {
                                                var result;
                                                return tslib_1.__generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0: return [4 /*yield*/, promise()];
                                                        case 1:
                                                            result = _a.sent();
                                                            if (!(!timedOut && !condition(result))) return [3 /*break*/, 3];
                                                            return [4 /*yield*/, repeater()];
                                                        case 2: return [2 /*return*/, _a.sent()];
                                                        case 3: return [2 /*return*/, result];
                                                    }
                                                });
                                            });
                                        })(),
                                    ])];
                            });
                        }); }, callback)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    RestAPI.prototype.ping = function (callback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.send(HTTPMethod.GET, '/heartbeat', null, callback, false)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return RestAPI;
}());
exports.RestAPI = RestAPI;
//# sourceMappingURL=RestAPI.js.map