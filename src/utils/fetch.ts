/**
 *  @internal
 *  @module Utils
 */

import camelCase from 'camelcase';
import { APIError } from '../errors/APIError';
import { transformKeys } from './object';

export async function parseJSON(response: Response, ignoreKeys: string[] = ['metadata']): Promise<any> {
    const text = await response.text();
    return text ? transformKeys(JSON.parse(text), camelCase, ignoreKeys) : {};
}

export async function checkStatus(response: Response): Promise<Response> {
    if (response.status >= 200 && response.status < 400) {
        return response;
    }

    const json = await parseJSON(response);
    throw new APIError(response.status, json);
}
