/**
 *  @internal
 *  @module Utils
 */

import { camelCase, snakeCase } from "change-case";

export type Transformer = (...args: any[]) => string;

export const toCamelCase = (key: string) => camelCase(key, { stripRegexp: /[^A-Z0-9.]/gi });

export const toSnakeCase = (key: string) => snakeCase(key, { stripRegexp: /[^A-Z0-9.]/gi });

const isObject = (value: unknown): value is Record<string, any> => typeof value === "object" && Boolean(value);

export const isBlob = (data: unknown): data is Blob =>
    isObject(data) &&
    typeof data.size === "number" &&
    typeof data.type === "string" &&
    typeof data.slice === "function";

export const transformKeys = (
    obj: Record<string, any> | unknown[],
    transformer: Transformer,
    ignoreKeys: string[] = []
): any => {
    const transformArray = (arr: unknown[], transformer: Transformer): any =>
        arr.map((item) => (isObject(item) ? transformKeys(item, transformer, ignoreKeys) : item));

    if (Array.isArray(obj)) {
        return transformArray(obj, transformer);
    }

    const ignoredKeySet = new Set(ignoreKeys || []);
    return Object.keys(obj || {}).reduce((acc: Record<string, any>, key: string) => {
        const value = obj[key];

        if (ignoredKeySet.has(key)) {
            return { ...acc, [key]: value };
        }

        const shouldTransformKeys = isObject(value) && !isBlob(value) && !Buffer.isBuffer(value);
        const formattedValue = shouldTransformKeys ? transformKeys(value, transformer, ignoreKeys) : value;

        acc[transformer(key)] = formattedValue;
        return acc;
    }, {});
};

/**
 * Returns a list from `keys` that are not found in `obj`
 */
export function missingKeys(obj: Record<string, any>, keys: string[] = []): string[] {
    if (!obj) {
        return keys;
    }

    const objKeys: string[] = Object.keys(obj);
    const missing: string[] = [];

    for (const key of keys) {
        if (objKeys.indexOf(key) === -1 || obj[key] === undefined) {
            missing.push(key);
        }
    }

    return missing;
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.keys(obj || {}).reduce((acc: any, key: unknown) => {
        return keys.indexOf(key as K) === -1 ? { ...acc, [key as K]: obj[key as K] } : acc;
    }, {});
}
