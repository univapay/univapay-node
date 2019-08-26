"use strict";
/**
 *  @internal
 *  @module Errors
 */
Object.defineProperty(exports, "__esModule", { value: true });
var APIError_1 = require("./APIError");
var PathParameterError_1 = require("./PathParameterError");
var RequestParameterError_1 = require("./RequestParameterError");
var RequestResponseError_1 = require("./RequestResponseError");
function getCodeByStatus(status) {
    var codeMap = {
        400: APIError_1.ResponseErrorCode.BadRequest,
        401: APIError_1.ResponseErrorCode.NotAuthorized,
        403: APIError_1.ResponseErrorCode.Forbidden,
        404: APIError_1.ResponseErrorCode.NotFound,
        405: APIError_1.ResponseErrorCode.NotAllowed,
        409: APIError_1.ResponseErrorCode.Conflicted,
        429: APIError_1.ResponseErrorCode.TooManyRequests,
        500: APIError_1.ResponseErrorCode.InternalServerError,
        503: APIError_1.ResponseErrorCode.ServiceUnavailable,
    };
    if (Object.keys(codeMap).indexOf(status.toString()) !== -1) {
        return codeMap[status];
    }
    return APIError_1.ResponseErrorCode.UnknownError;
}
function fromError(error) {
    if (error instanceof PathParameterError_1.PathParameterError || error instanceof RequestParameterError_1.RequestParameterError) {
        return new RequestResponseError_1.RequestError({
            code: APIError_1.ResponseErrorCode.ValidationError,
            errors: [
                {
                    field: error.parameter,
                    reason: APIError_1.ResponseErrorCode.RequiredValue,
                },
            ],
        });
    }
    else if (error instanceof APIError_1.APIError) {
        return new RequestResponseError_1.ResponseError({
            code: error.response ? error.response.code : getCodeByStatus(error.status),
            httpCode: error.status,
            errors: error.response ? error.response.errors || [] : [],
        });
    }
    return new RequestResponseError_1.ResponseError({
        code: APIError_1.ResponseErrorCode.UnknownError,
        errors: [],
    });
}
exports.fromError = fromError;
//# sourceMappingURL=parser.js.map