/**
 *  @module Errors
 */
export declare class RequestParameterError extends Error {
    parameter: string;
    constructor(parameter: string);
}
