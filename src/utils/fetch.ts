/**
 *  @internal
 *  @module Utils
 */

import { APIError } from "../errors/APIError";

import { toCamelCase, transformKeys } from "./object";

export async function parseJSON(response: Response, ignoreKeys: string[] = ["metadata"]): Promise<any> {
    const text = await response.text();
    return text ? transformKeys(JSON.parse(text), toCamelCase, ignoreKeys) : {};
}

export async function checkStatus(response: Response): Promise<Response> {
    if (response.status >= 200 && response.status < 400) {
        return response;
    }

    const json = await parseJSON(response, ["metadata"]);
    throw new APIError(response.status, json);
}
