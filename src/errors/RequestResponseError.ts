/**
 *  @module Errors
 */

import { ErrorResponse } from "../api/RestAPI";

type ErrorRequest = Omit<ErrorResponse, "status">;

const serializeErrorResponse = ({ code, httpCode, errors }: ErrorRequest): string =>
    `Code: ${code}, HttpCode: ${httpCode}, Errors: ${(errors || [])
        .filter(Boolean)
        .map((error) =>
            typeof error === "string" ? error : `${error.reason}${"field" in error ? ` (${error.field})` : ""}`
        )
        .join(", ")}`;

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
