import { ResponseErrorCode, RequestErrorCode } from "../../src/errors/APIError.js";
import { ErrorItem, RawErrorRequest, RequestError } from "../../src/errors/RequestResponseError.js";

export const createRequestError = (fields: string[]): RequestError => {
    return new RequestError({
        code: ResponseErrorCode.ValidationError,
        errors: fields.map((field: string) => ({ field, reason: ResponseErrorCode.RequiredValue })),
    });
};

export const createRawErrorRequest = (
    code: ResponseErrorCode | RequestErrorCode,
    errors: ErrorItem | ErrorItem[] = [],
    httpCode?: number
): RawErrorRequest => ({
    httpCode,
    code,
    errors,
});
