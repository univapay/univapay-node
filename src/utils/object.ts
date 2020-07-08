/**
 *  @internal
 *  @module Utils
 */

export type Transformer = (...args: any[]) => string;

export function transformKeys(obj: Record<string, any>, transformer: Transformer, ignoreKeys: string[] = []): any {
    const isObject = (value: unknown): value is Record<string, any> => typeof value === "object" && Boolean(value);

    const transformArray = <T>(arr: T[]): T[] =>
        arr.map((item) => (isObject(item) ? transformKeys(item, transformer) : item));

    if (Array.isArray(obj)) {
        return transformArray(obj);
    }

    return Object.keys(obj || {}).reduce((acc: Record<string, any>, key: string) => {
        let value = obj[key];

        if (ignoreKeys.includes(key)) {
            return { ...acc, [key]: value };
        }

        if (isObject(value)) {
            if (Array.isArray(value)) {
                value = transformArray(value);
            } else {
                value = transformKeys(value, transformer);
            }
        }

        acc[transformer(key)] = value;
        return acc;
    }, {});
}

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
