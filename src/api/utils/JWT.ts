/**
 *  @internal
 *  @module Utils
 */
import decode from "jwt-decode";

import { JWTError } from "../../errors/JWTError.js";
import { toCamelCase, transformKeys } from "../../utils/object.js";

export interface JWTBasePayload {
    iss?: string;
    sub?: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    iat?: number;
    jti?: string;
}

export type JWTPayload<Payload> = JWTBasePayload & Payload;

export const parseJWT = <Payload>(jwt?: string | null, keepKeys = false): JWTPayload<Payload> | null => {
    if (!jwt) {
        return null;
    }

    if (jwt.split(".").length !== 3) {
        throw new JWTError();
    }

    try {
        const decoded = decode<Payload>(jwt);
        return keepKeys || typeof decoded === "string" ? decoded : transformKeys(decoded, toCamelCase);
    } catch {
        throw new JWTError();
    }
};

const safeParseJWT = <Payload>(jwt?: string | null): JWTPayload<Payload> | null => {
    try {
        return jwt ? decode<Payload>(jwt) : null;
    } catch (error) {
        return null;
    }
};

const BearerRegexp = /^Bearer (.*)$/i;

/**
 *  @internal
 */
export const extractJWT = (response: Response): string | null => {
    const headerNames = ["authorization", "x-amzn-remapped-authorization", "X-REFRESH-AUTHORIZATION"];
    const header = headerNames.reduce((acc: string, name: string) => {
        const header = response.headers.get(name);

        // The bearer regex matches fixes hammerhead and safe parse ensure that valid jwt are used even without bearer
        return header?.match(BearerRegexp)?.[1] || safeParseJWT(header?.replace("Bearer", "")?.trim()) ? header : acc;
    }, null);

    // Support both with and without the `Bearer` keyword, only the token part interest us here
    return header?.match(BearerRegexp)?.[1]?.trim() || header?.replace("Bearer", "").trim() || null;
};
