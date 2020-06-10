/**
 *  @internal
 *  @module Utils
 */
import { Omit } from 'type-zoo';

export type Transformer = (...args: any[]) => string;

export function transformKeys(obj: any, transformer: Transformer, ignoreKeys: string[] = []): any {
    const isObject = (o: any): boolean => typeof o === 'object' && Boolean(o);

    const transformArray = arr => (arr as any[]).map((i: any) => (isObject(i) ? transformKeys(i, transformer) : i));

    if (Array.isArray(obj)) {
        return transformArray(obj);
    }

    return Object.keys(obj || {}).reduce((r: any, k: string) => {
        let v: any = (obj as any)[k];

        if (ignoreKeys.includes(k)) {
            return { ...r, [k]: v };
        }

        if (isObject(v)) {
            if (Array.isArray(v)) {
                v = transformArray(v);
            } else {
                v = transformKeys(v, transformer);
            }
        }
        (r as any)[transformer(k)] = v;
        return r;
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

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    return Object.keys(obj || {}).reduce((acc: any, key: any) => {
        return keys.indexOf(key) === -1 ? { ...acc, [key]: obj[key] } : acc;
    }, {});
}
