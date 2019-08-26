/**
 *  @module Errors
 */

export class JWTError extends Error {
    constructor() {
        super('Invalid JSON Web Token');
        Object.setPrototypeOf(this, JWTError.prototype);
    }
}
