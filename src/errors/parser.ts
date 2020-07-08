/**
 *  @internal
 *  @module Errors
 */

import { APIError, ResponseErrorCode } from "./APIError";
import { PathParameterError } from "./PathParameterError";
import { RequestParameterError } from "./RequestParameterError";
import { RequestError, RequestResponseBaseError, ResponseError } from "./RequestResponseError";

function getCodeByStatus(status: number): string {
    const codeMap: Record<number, string> = {
        400: ResponseErrorCode.BadRequest,
        401: ResponseErrorCode.NotAuthorized,
        403: ResponseErrorCode.Forbidden,
        404: ResponseErrorCode.NotFound,
        405: ResponseErrorCode.NotAllowed,
        409: ResponseErrorCode.Conflicted,
        429: ResponseErrorCode.TooManyRequests,
        500: ResponseErrorCode.InternalServerError,
        503: ResponseErrorCode.ServiceUnavailable,
    };

    if (Object.keys(codeMap).indexOf(status.toString()) !== -1) {
        return codeMap[status];
    }

    return ResponseErrorCode.UnknownError;
}

export function fromError(error: Error): RequestResponseBaseError {
    if (error instanceof PathParameterError || error instanceof RequestParameterError) {
        return new RequestError({
            code: ResponseErrorCode.ValidationError,
            errors: [
                {
                    field: error.parameter,
                    reason: ResponseErrorCode.RequiredValue,
                },
            ],
        });
    } else if (error instanceof APIError) {
        return new ResponseError({
            code: error.response ? error.response.code : getCodeByStatus(error.status),
            httpCode: error.status,
            errors: error.response ? error.response.errors || error.response : [],
        });
    }

    return new ResponseError({
        code: ResponseErrorCode.UnknownError,
        errors: [],
    });
}
