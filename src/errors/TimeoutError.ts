/**
 *  @module Errors
 */

export class TimeoutError extends Error {
    timeout: number;

    constructor(timeout: number) {
        super(`Timed out after ${timeout} milliseconds.`);
        this.timeout = timeout;
        this.name = 'TimeoutError';
        Object.setPrototypeOf(this, TimeoutError.prototype);
    }
}
