/**
 *  @internal
 *  @module Utils
 */
import { snakeCase } from "change-case";
import jwtDecode from "jwt-decode";

import { JWTError } from "../../errors/JWTError";
import { transformKeys } from "../../utils/object";

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

export function parseJWT<Payload>(jwt: string, keepKeys = false): JWTPayload<Payload> | null {
    if (!jwt) {
        return null;
    }

    if (jwt.split(".").length !== 3) {
        throw new JWTError();
    }

    try {
        const decoded = jwtDecode(jwt);
        return keepKeys ? decoded : transformKeys(decoded, camelCase);
    } catch {
        throw new JWTError();
    }
}

const BearerRegexp = /^Bearer (.*)$/i;

/**
 *  @internal
 */
export function extractJWT(response: Response): string | null {
    const headerNames = ["authorization", "x-amzn-remapped-authorization", "X-REFRESH-AUTHORIZATION"];
    const header = headerNames.reduce((acc: string, name: string) => response.headers.get(name) || acc, null);

    if (header === null) {
        return null;
    }

    const matches = header.match(BearerRegexp);
    return matches === null ? null : matches[1];
}
