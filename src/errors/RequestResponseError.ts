/**
 *  @module Errors
 */

import { ErrorResponse, SubError, ValidationError } from "../api/RestAPI";

type ErrorRequest = Omit<ErrorResponse, "status">;

const isSymbol = (value: unknown): value is symbol => ["string", "number", "boolean"].includes(typeof value);
const serializeErrorResponse = ({ code, httpCode, errors }: ErrorRequest): string => {
    // (pH) FIXME: `errors sometimes is not an array. Fix type and maybe the cause of it
    const formattedErrors = (() => {
        if (!errors || isSymbol(errors)) {
            return errors;
        }

        // (pH) FIXME: Remove this once the ts services will be fixed
        const errorList = Array.isArray(errors) ? errors : [errors];

        return errorList.filter(Boolean).map((error: SubError | ValidationError | symbol) => {
            if (isSymbol(error)) {
                return error; // (pH) FIXME: special handling for wrongly formatted. Fix the ErrorRequest type.
            }

            return "field" in error ? `${error.reason} (${error.field})` : `${error.reason}`;
        });
    })();

    return `Code: ${code}, HttpCode: ${httpCode}, Errors: ${formattedErrors.join(", ")}`;
};

export class RequestResponseBaseError extends Error {
    errorResponse: ErrorResponse;

    constructor(errorResponse: ErrorRequest) {
        super(serializeErrorResponse(errorResponse));
        Object.setPrototypeOf(this, RequestResponseBaseError.prototype);
        this.errorResponse = { status: "error", ...errorResponse };
    }
}

export class RequestError extends RequestResponseBaseError {
    constructor(errorResponse: ErrorRequest) {
        super(errorResponse);
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

export class ResponseError extends RequestResponseBaseError {
    constructor(errorResponse: ErrorRequest) {
        super(errorResponse);
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}
