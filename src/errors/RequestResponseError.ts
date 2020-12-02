/**
 *  @module Errors
 */

import { ErrorResponse } from "../api/RestAPI";

type ErrorRequest = Omit<ErrorResponse, "status">;

const serializeErrorResponse = ({ code, httpCode, errors }: ErrorRequest): string => {
    // (pH) FIXME: `errors sometimes is not an array. Fix type and maybe the cause of it
    const formattedErrors = (errors || [])?.filter(Boolean).map((error) => {
        switch (typeof error) {
            case "string":
            case "number":
            case "boolean":
                return error; // (pH) FIXME: special handling for wrongly formatted. Fix the ErrorRequest type.

            default:
                return "field" in error ? `${error.reason} (${error.field})` : `${error.reason}`;
        }
    });

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
