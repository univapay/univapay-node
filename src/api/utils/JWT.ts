/**
 *  @internal
 *  @module Utils
 */
import { jwtDecode } from "jwt-decode";

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
        const decoded = jwtDecode<Payload>(jwt);
        return keepKeys || typeof decoded === "string" ? decoded : transformKeys(decoded, toCamelCase);
    } catch {
        throw new JWTError();
    }
};

const safeParseJWT = <Payload>(jwt?: string | null): JWTPayload<Payload> | null => {
    try {
        return jwt ? jwtDecode<Payload>(jwt) : null;
    } catch (error) {
        return null;
    }
};

const BearerRegexp = /^Bearer (.*)$/i;

const getHeaderJwt = (header: string): string | null => {
    if (!header) {
        return null;
    }

    const trimmedHeader = header.replace("Bearer", "").trim();
    if (safeParseJWT(trimmedHeader)) {
        return trimmedHeader;
    }

    // Support bearer match for hammerhead
    const matches = header.match(BearerRegexp);
    return matches ? matches[1] : null;
};

/**
 *  @internal
 */
export const extractJWT = (response: Response): string | null => {
    const headerName = ["X-REFRESH-AUTHORIZATION", "x-amzn-remapped-authorization", "authorization"].find(
        (name: string) => !!getHeaderJwt(response.headers.get(name)),
    );

    return getHeaderJwt(response.headers.get(headerName));
};
