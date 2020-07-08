import decamelize from "decamelize";

function isPrimitive(value: any): boolean {
    return typeof value === "object" ? value === null : typeof value !== "function";
}

function isObject(value: any): boolean {
    return value === Object(value);
}

function isClassInstance(value: any): boolean {
    return typeof value === "object" && !(value instanceof Array) && value.constructor !== Object;
}

export function containsBinaryData(data: any): boolean {
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
}

export function objectToFormData(obj: any, rootName = "", ignoreList: string[] = null) {
    const formData = new FormData();

    function isBlob(data: any): boolean {
        if (isObject(data)) {
            return typeof data.size === "number" && typeof data.type === "string" && typeof data.slice === "function";
        }
        return false;
    }

    function ignore(root) {
        return (
            Array.isArray(ignoreList) &&
            ignoreList.some(function (x) {
                return x === root;
            })
        );
    }

    function appendFormData(data: any, root = "") {
        if (!ignore(root)) {
            if (isBlob(data)) {
                formData.append(decamelize(root), data);
            } else if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    appendFormData(data[i], `${root}[${i}]`);
                }
            } else if (isObject(data) && data && !Buffer.isBuffer(data)) {
                for (const key in data) {
                    if (root === "") {
                        appendFormData(data[key], key);
                    } else {
                        appendFormData(data[key], `${root}.${key}`);
                    }
                }
            } else {
                if (data !== null && typeof data !== "undefined") {
                    formData.append(decamelize(root), data);
                }
            }
        }
    }

    appendFormData(obj, rootName);

    return formData;
}
