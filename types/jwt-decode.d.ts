export declare class InvalidTokenError extends Error {}

export declare interface JwtDecodeOptions {
    header?: boolean;
}

export declare interface JwtHeader {
    typ?: string;
    alg?: string;
}

export declare interface JwtPayload {
    iss?: string;
    sub?: string;
    aud?: string[] | string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
}

declare function jwtDecode<T = unknown>(token: string, options?: JwtDecodeOptions): T;

export default jwtDecode;
