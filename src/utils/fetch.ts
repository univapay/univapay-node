/**
 *  @internal
 *  @module Utils
 */

import { parse } from "@apimatic/json-bigint";

import { APIError } from "../errors/APIError.js";

import { toCamelCase, transformKeys } from "./object.js";

export const parseJSON = async <FormattedBody>(
    response: Response,
    ignoreKeys: string[] = ["metadata"]
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
