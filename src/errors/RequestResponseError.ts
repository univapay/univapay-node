/**
 *  @module Errors
 */

import { Omit } from 'type-zoo';
import { ErrorResponse } from '../api/RestAPI';

export class RequestResponseBaseError extends Error {
    errorResponse: ErrorResponse;

    constructor(errorResponse: Omit<ErrorResponse, 'status'>) {
        super();
        Object.setPrototypeOf(this, RequestResponseBaseError.prototype);
        this.errorResponse = { status: 'error', ...errorResponse };
    }
}

export class RequestError extends RequestResponseBaseError {
    constructor(errorResponse: Omit<ErrorResponse, 'status'>) {
        super(errorResponse);
        Object.setPrototypeOf(this, RequestError.prototype);
    }
}

export class ResponseError extends RequestResponseBaseError {
    constructor(errorResponse: Omit<ErrorResponse, 'status'>) {
        super(errorResponse);
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
}
