/**
 *  @module Errors
 */
import { Omit } from 'type-zoo';
import { ErrorResponse } from '../api/RestAPI';
export declare class RequestResponseBaseError extends Error {
    errorResponse: ErrorResponse;
    constructor(errorResponse: Omit<ErrorResponse, 'status'>);
}
export declare class RequestError extends RequestResponseBaseError {
    constructor(errorResponse: Omit<ErrorResponse, 'status'>);
}
export declare class ResponseError extends RequestResponseBaseError {
    constructor(errorResponse: Omit<ErrorResponse, 'status'>);
}
