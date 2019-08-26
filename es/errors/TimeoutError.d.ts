/**
 *  @module Errors
 */
export declare class TimeoutError extends Error {
    timeout: number;
    constructor(timeout: number);
}
