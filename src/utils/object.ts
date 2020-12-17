/**
 *  @internal
 *  @module Utils
 */

export type Transformer = (...args: any[]) => string;

export const transformKeys = (
    obj: Record<string, any> | unknown[],
    transformer: Transformer,
    ignoreKeys: string[] = []
): any => {
    const isObject = (value: unknown): value is Record<string, any> => typeof value === "object" && Boolean(value);

    const transformArray = (arr: unknown[], transformer: Transformer): any =>
        arr.map((item) => (isObject(item) ? transformKeys(item, transformer) : item));

    if (Array.isArray(obj)) {
        return transformArray(obj, transformer);
    }

    const ignoredKeySet = new Set(ignoreKeys || []);
    return Object.keys(obj || {}).reduce((acc: Record<string, any>, key: string) => {
        const value = obj[key];

        if (ignoredKeySet.has(key)) {
            return { ...acc, [key]: value };
        }

        const formattedValue = isObject(obj[key]) ? transformKeys(obj[key], transformer) : obj[key];
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
