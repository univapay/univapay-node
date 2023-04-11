import { ResponseErrorCode, RequestErrorCode } from "../../src/errors/APIError.js";
import { RequestError } from "../../src/errors/RequestResponseError.js";
import { ErrorResponse, SubError, ValidationError } from "../../src/api/RestAPI.js";

export const createRequestError = (fields: string[]): RequestError => {
    return new RequestError({
        code: ResponseErrorCode.ValidationError,
        errors: fields.map((field: string) => ({ field, reason: ResponseErrorCode.RequiredValue })),
    });
};

export const createErrorResponse = (
    code: ResponseErrorCode | RequestErrorCode,
    errors: (SubError | ValidationError)[] = [],
    httpCode?: number
): ErrorResponse => ({ httpCode, status: "error", code, errors });
