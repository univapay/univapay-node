import { isBlob, toSnakeCase, transformKeys } from "../../utils";

const isPrimitive = (value: unknown): value is symbol | null =>
    typeof value === "object" ? value === null : typeof value !== "function";

const isObject = (value: unknown): value is Record<string, unknown> => value === Object(value);

const isClassInstance = (value: unknown): boolean =>
    typeof value === "object" && !(value instanceof Array) && value.constructor !== Object;

export const containsBinaryData = (data: unknown): boolean => {
    if (isPrimitive(data)) {
        return false;
    } else if (isClassInstance(data)) {
        return true;
    } else if (Array.isArray(data)) {
        return data.reduce((result: boolean, value: any) => result || containsBinaryData(value), false);
    } else if (isObject(data)) {
        return Object.keys(data).reduce((result: boolean, key: any) => result || containsBinaryData(data[key]), false);
    }

    return false;
};

export const objectToFormData = (obj: unknown, keyFormatter = toSnakeCase, ignoredKeys: string[] = []) => {
    const formData = new FormData();

    const appendFormData = (data: unknown, path = "") => {
        if (isBlob(data)) {
            // Blob
            formData.append(path, data);
        } else if (Array.isArray(data)) {
            // Array
            for (let i = 0; i < data.length; i++) {
                appendFormData(data[i], `${path}[${i}]`);
            }
        } else if (data && isObject(data) && !Buffer.isBuffer(data)) {
            // Object
            for (const key in data) {
                appendFormData(data[key], path ? `${path}.${key}` : key);
            }
        } else if (data !== null && typeof data !== "undefined") {
            // symbols & Buffer
            formData.append(path, data as string);
        }
    };

    appendFormData(transformKeys(obj, keyFormatter, ignoredKeys));

    return formData;
};
