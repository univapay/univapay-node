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

const safeParseJWT = <Payload>(jwt?: string | null, keepKeys = false): JWTPayload<Payload> | null => {
    try {
        return parseJWT(jwt, keepKeys);
    } catch (error) {
        return null;
    }
};

/**
 *  @internal
 */
export const extractJWT = (response: Response): string | null => {
    const headerNames = ["authorization", "x-amzn-remapped-authorization", "X-REFRESH-AUTHORIZATION"];
    const header = headerNames.reduce((acc: string, name: string) => {
        const header = response.headers.get(name);
        if (!safeParseJWT(header?.replace("Bearer", "")?.trim())) {
            return acc;
        }

        // Prefer header with the `Bearer` keyword but does not require it for valid JWT
        const hasPriority = !acc || header?.includes("Bearer") || !acc?.includes("Bearer");
        return hasPriority ? header : acc;
    }, null);

    if (!header && typeof header !== "string") {
        return null;
    }

    // Support both with and without the `Bearer` keyword, only the token part interest us here
    return header?.replace("Bearer", "").trim() || null;
};
