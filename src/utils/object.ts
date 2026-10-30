/**
 *  @internal
 *  @module Utils
 */

import { camelCase, snakeCase } from "change-case";
import isBuffer from "is-buffer";

export type Transformer = (...args: any[]) => string;

// Dots are kept as nested key separators, each segment is converted independently
const preserveDots = (transform: (input: string) => string) => (key: string) => key.split(".").map(transform).join(".");

export const toCamelCase = preserveDots(camelCase);

export const toSnakeCase = preserveDots(snakeCase);

const isObject = (value: unknown): value is Record<string, any> => typeof value === "object" && Boolean(value);

export const isBlob = (data: unknown): data is Blob =>
    isObject(data) &&
    typeof data.size === "number" &&
    typeof data.type === "string" &&
    typeof data.slice === "function";

export const transformKeys = <Data = Record<string, unknown> | unknown[]>(
    obj: Data,
    transformer: Transformer,
    ignoreKeys: string[] = [],
): Data => {
    if (Array.isArray(obj)) {
        return obj.map((item) => (isObject(item) ? transformKeys(item, transformer, ignoreKeys) : item)) as Data;
    }

    const ignoredKeySet = new Set(ignoreKeys);
    return Object.keys(obj || {}).reduce(
        (acc: Record<string, any>, key: string) => {
            const value = (obj as Record<string, any>)[key];

            if (ignoredKeySet.has(key)) {
                return { ...acc, [key]: value };
            }

            const shouldTransformKeys = isObject(value) && !isBlob(value) && !isBuffer(value);
            const formattedValue = shouldTransformKeys ? transformKeys(value, transformer, ignoreKeys) : value;

            acc[transformer(key)] = formattedValue;
            return acc;
        },
        {} as Record<string, any>,
    ) as Data;
};
