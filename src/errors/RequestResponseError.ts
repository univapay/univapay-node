/**
 *  @module Errors
 */

import { ErrorResponse } from "../api/RestAPI";

const serializeErrorResponse = ({ code, httpCode, errors }: Omit<ErrorResponse, "status">): string =>
    `Code: ${code}, HttpCode: ${httpCode}, Errors: ${errors
        .map((error) => ("field" in error ? `${error.reason} (${error.field})` : error.reason))
        .join(", ")}`;

export class RequestResponseBaseError extends Error {
    errorResponse: ErrorResponse;

    constructor(errorResponse: Omit<ErrorResponse, "status">) {
        super(serializeErrorResponse(errorResponse));
        Object.setPrototypeOf(this, RequestResponseBaseError.prototype);
        this.errorResponse = { status: "error", ...errorResponse };
    }
}

export class RequestError extends RequestResponseBaseError {
    constructor(errorResponse: Omit<ErrorResponse, "status">) {
        super(errorResponse);
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

export class ResponseError extends RequestResponseBaseError {
    constructor(errorResponse: Omit<ErrorResponse, "status">) {
        super(errorResponse);
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}
