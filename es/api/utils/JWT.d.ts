/**
 *  @internal
 *  @module Utils
 */
export interface JWTBasePayload {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
}
export declare type JWTPayload<Payload> = JWTBasePayload & Payload;
export declare function parseJWT<Payload>(jwt: string, keepKeys?: boolean): JWTPayload<Payload> | null;
/**
 *  @internal
 */
export declare function extractJWT(response: Response): string | null;
