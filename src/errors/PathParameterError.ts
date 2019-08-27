/**
 *  @module Errors
 */

export class PathParameterError extends Error {
    parameter: string;

    constructor(parameter: string) {
        super();
        this.parameter = parameter;
        Object.setPrototypeOf(this, PathParameterError.prototype);
    }
}
