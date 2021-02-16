/**
 *  @module Errors
 */

import { ErrorResponse, SubError, ValidationError } from "../api/RestAPI";

import { RequestErrorCode, ResponseErrorCode } from "./APIError";

type ErrorItem = boolean | number | string | SubError | ValidationError;
type RawErrorRequest = {
    httpCode?: number;
    code: ResponseErrorCode | RequestErrorCode;
    errors: ErrorItem | ErrorItem[];
};

type FormattedErrorRequest = Omit<ErrorResponse, "status">;

const isSymbol = (value: unknown): value is string | number | boolean =>
    ["string", "number", "boolean"].includes(typeof value);

/**
 * The function format the ill-formatted errors:
 * - When errors is not an array, use it as the only error
 * - Filters null and undefined errors
 * - When an item of errors is a symbol rather than an object, returns the UNKNOWN_ERROR as the code
 */
const formatErrors = ({ errors: rawErrors, ...rest }: RawErrorRequest): FormattedErrorRequest => {
    const errorList = Array.isArray(rawErrors) ? rawErrors : [rawErrors];

    const formattedErrors: (SubError | ValidationError)[] = errorList.filter(Boolean).map((error: ErrorItem) => {
        if (typeof error === "string") {
            const errorCodeKeys = [...Object.keys(ResponseErrorCode), ...Object.keys(RequestErrorCode)];
            const upperCaseError = error.toUpperCase();
            const isValidError = errorCodeKeys.some(
                (key) => ResponseErrorCode[key] === upperCaseError || RequestErrorCode[key] === upperCaseError
            );

            return {
                reason: isValidError ? (upperCaseError as ResponseErrorCode) : ResponseErrorCode.UnknownError,
                field: null,
            };
        }

        if (isSymbol(error)) {
            return { reason: ResponseErrorCode.UnknownError, field: null };
        }

        return error;
    });

    return { ...rest, errors: formattedErrors };
};

const serializeErrorResponse = ({ code, httpCode, errors }: FormattedErrorRequest): string => {
    const formattedErrors = errors.map((error: SubError | ValidationError) =>
        "field" in error && !!error.field ? `${error.reason} (${error.field})` : `${error.reason}`
    );

    return `Code: ${code}, HttpCode: ${httpCode}, Errors: ${formattedErrors.join(", ")}`;
};

export class RequestResponseBaseError extends Error {
    errorResponse: ErrorResponse;

    constructor(errorResponse: RawErrorRequest) {
        const formattedErrorResponse = formatErrors(errorResponse);
        super(serializeErrorResponse(formattedErrorResponse));

        Object.setPrototypeOf(this, RequestResponseBaseError.prototype);
        this.errorResponse = { status: "error", ...formattedErrorResponse };
    }
}

export class RequestError extends RequestResponseBaseError {
    constructor(errorResponse: RawErrorRequest) {
        super(errorResponse);
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

export class ResponseError extends RequestResponseBaseError {
    constructor(errorResponse: RawErrorRequest) {
        super(errorResponse);
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}
