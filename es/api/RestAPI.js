/**
 *  @module SDK/API
 */
import * as tslib_1 from "tslib";
import 'isomorphic-fetch';
import 'isomorphic-form-data';
import decamelize from 'decamelize';
import { DEFAULT_ENDPOINT, ENV_KEY_ENDPOINT, ENV_KEY_APP_ID, ENV_KEY_SECRET, POLLING_TIMEOUT, IDEMPOTENCY_KEY_HEADER, } from '../common/constants';
import { transformKeys, omit } from '../utils/object';
import { checkStatus, parseJSON } from '../utils/fetch';
import { TimeoutError } from '../errors/TimeoutError';
import { fromError } from '../errors/parser';
import { stringify as stringifyQuery } from 'query-string';
import { ResponseErrorCode } from '../errors/APIError';
import { extractJWT, parseJWT } from './utils/JWT';
import { RequestError } from '../errors/RequestResponseError';
import { containsBinaryData, objectToFormData } from './utils/payload';
export var HTTPMethod;
(function (HTTPMethod) {
    HTTPMethod["GET"] = "GET";
    HTTPMethod["POST"] = "POST";
    HTTPMethod["PATCH"] = "PATCH";
    HTTPMethod["PUT"] = "PUT";
    HTTPMethod["DELETE"] = "DELETE";
    HTTPMethod["OPTION"] = "OPTION";
    HTTPMethod["HEAD"] = "HEAD";
})(HTTPMethod || (HTTPMethod = {}));
var internalParams = [
    'appId',
    'secret',
    'authToken',
    'jwt',
    'idempotentKey',
    'origin',
];
function getData(data) {
    return omit(data, internalParams);
}
function getRequestBody(data) {
    return containsBinaryData(data) ? objectToFormData(data) : JSON.stringify(transformKeys(data, decamelize));
}
function getIdempotencyKey(data) {
    return typeof data === 'object' && !!data ? data.idempotentKey : null;
}
function getOrigin(data) {
    return typeof data === 'object' && !!data ? data.origin : null;
}
function stringifyParams(data) {
    var query = stringifyQuery(transformKeys(data, decamelize), { arrayFormat: 'bracket' });
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
                    err = error_1 instanceof TimeoutError ? error_1 : fromError(error_1);
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
        this.endpoint = options.endpoint || process.env[ENV_KEY_ENDPOINT] || DEFAULT_ENDPOINT;
        this.origin = options.origin || this.origin;
        this.jwtRaw = options.jwt;
        if (options.handleUpdateJWT && typeof options.handleUpdateJWT === 'function') {
            this.handleUpdateJWT = options.handleUpdateJWT;
        }
        this.appId = options.appId || process.env[ENV_KEY_APP_ID];
        this.secret = options.secret || process.env[ENV_KEY_SECRET];
        this.authToken = options.authToken;
    }
    Object.defineProperty(RestAPI.prototype, "jwtRaw", {
        get: function () {
            return this._jwtRaw;
        },
        set: function (jwtRaw) {
            this.jwt = parseJWT(jwtRaw);
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
                            throw new RequestError({
                                code: ResponseErrorCode.ExpiredLoginToken,
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
                                            return [4 /*yield*/, extractJWT(response)];
                                        case 2:
                                            jwt = _a.sent();
                                            if (jwt) {
                                                this.jwtRaw = jwt;
                                                this.handleUpdateJWT(jwt);
                                            }
                                            return [4 /*yield*/, checkStatus(response)];
                                        case 3:
                                            _a.sent();
                                            contentType = response.headers.get('content-type');
                                            if (!(contentType === 'application/json')) return [3 /*break*/, 5];
                                            return [4 /*yield*/, parseJSON(response)];
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
        var isFormData = containsBinaryData(data);
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
            headers.append(IDEMPOTENCY_KEY_HEADER, idempotentKey);
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
        if (timeout === void 0) { timeout = POLLING_TIMEOUT; }
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
                                                reject(new TimeoutError(timeout));
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
export { RestAPI };
//# sourceMappingURL=RestAPI.js.map