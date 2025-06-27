/**
 *  @internal
 *  @module Utils
 */

import { parse } from "@apimatic/json-bigint";

import { APIError, ResponseErrorCode } from "../errors/APIError.js";
import { ResponseError } from "../errors/RequestResponseError.js";

import { toCamelCase, transformKeys } from "./object.js";

const COOLDOWN_ADJUST = 1.2;
const COOLDOWN_WAIT = 50; // Cooldown wait period after first fail (50ms)
const FAIL_TRESHOLD = 10; // Fail processing after X concurrent fails. If 0, then will try forever.

export const rateLimit = <R>(exec: (...args: any[]) => Promise<R>): Promise<R> => {
    let cooldown = 0;
    let tries = 0;

    return new Promise((resolve, reject) => {
        const executor = async () => {
            try {
                tries++;
                const result: R = await exec();
                cooldown = 0;
                tries = 0;
                resolve(result);
            } catch (error) {
                if (
                    error instanceof ResponseError &&
                    (error.errorResponse.code === ResponseErrorCode.TooManyRequests ||
                        error.errorResponse.httpCode === 429)
                ) {
                    if (FAIL_TRESHOLD > 0 && tries > FAIL_TRESHOLD) {
                        reject(error);
                    } else {
                        cooldown = cooldown === 0 ? COOLDOWN_WAIT : cooldown * COOLDOWN_ADJUST;
                        setTimeout(executor, cooldown);
                    }
                } else {
                    reject(error);
                }
            }
        };

        return executor();
    });
};

export const parseJSON = async <FormattedBody>(
    response: Response,
    ignoreKeys: string[] = ["metadata"],
): Promise<FormattedBody> => {
    const text = await response.text();
    return text ? transformKeys(parse(text), toCamelCase, ignoreKeys) : {};
};

export const checkStatus = async (response: Response): Promise<Response> => {
    if (response.status >= 200 && response.status < 400) {
        return response;
    }

    const json = await parseJSON(response, ["metadata"]);
    throw new APIError(response.status, json);
};
