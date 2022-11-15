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
        const decoded = decode(jwt);
        return keepKeys || typeof decoded === "string" ? decoded : transformKeys(decoded, toCamelCase);
    } catch {
        throw new JWTError();
    }
};

const BearerRegexp = /^Bearer (.*)$/i;

/**
 *  @internal
 */
export const extractJWT = (response: Response): string | null => {
    const headerNames = ["authorization", "x-amzn-remapped-authorization", "X-REFRESH-AUTHORIZATION"];
    const header = headerNames.reduce((acc: string, name: string) => response.headers.get(name) || acc, null);

    if (header === null) {
        return null;
    }

    const matches = header.match(BearerRegexp);
    return matches === null ? null : matches[1];
};
