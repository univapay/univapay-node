/**
 *  @internal
 *  @module Resources
 */
import { EventEmitter } from "events";

import { ApiSendOptions, AuthParams, HTTPMethod, RestAPI, SendData } from "../api/RestAPI.js";
import { fromError } from "../errors/parser.js";
import { PathParameterError } from "../errors/PathParameterError.js";
import { RequestParameterError } from "../errors/RequestParameterError.js";
import { isBlob } from "../utils/object.js";

export type DefinedRoute = (data?: unknown, auth?: AuthParams, pathParams?: Record<string, string>) => Promise<any>;

/**
 * Returns a path with pathParams filled into `:paramName`.
 *
 * If the path is wrapped in `()`, the path within will
 * be omitted if one or more required params are missing.
 *
 * e.g.
 * ```
 * path = "(/merchant/:merchantId/store/:storeId)/platforms"
 * pathParams = { merchantId: "123" }
 * // result: "/platforms"
 *
 * path = "(/merchant/:merchantId/store/:storeId)/platforms"
 * pathParams = { merchantId: "123", storeId: "456" }
 * // result: "merchant/123/store/456/platforms"
 * ```
 *
 * @param path The full path to compile, e.g. `(/merchant/:merchantId)/store/:storeId`
 * @param pathParams Object of params to fill into the path, e.g. `{ merchantId: "abc" }`
 */
function compilePath(path: string, pathParams: Record<string, string>): string {
    return path
        .replace(/\((\w|:|\/)+\)/gi, (o: string) => {
            const part: string = o.replace(/:(\w+)/gi, (s: string, p: string) => {
                return pathParams[p] || s;
            });
            return part.indexOf(":") === -1 ? part.replace(/\(|\)/g, "") : "";
        })
        .replace(/:(\w+)/gi, (s: string, p: string) => pathParams[p] || s);
}

type ObjectType =
    | "array"
    | "bigint"
    | "boolean"
    | "function"
    | "null"
    | "number"
    | "object"
    | "string"
    | "symbol"
    | "undefined"
    | "blob";

const getObjectType = (data: unknown): ObjectType => {
    switch (true) {
        case data === null:
            return "null";

        case Array.isArray(data):
            return "array";

        case isBlob(data):
            return "blob";

        default:
            return typeof data;
    }
};

export type DefineRouteOptions = ApiSendOptions & {
    /**
     * Parameters required for the route to be called.
     */
    requiredParams?: string[];
};

export abstract class Resource extends EventEmitter {
    protected api: RestAPI;

    constructor(api: RestAPI) {
        super();

        this.api = api;
        this.on("newListener", (event, listener) => {
            if (event === "newListener" || event === "removeListener") {
                return;
            }

            api.on(event, listener);
        });
        this.on("removeListener", (event, listener) => api.removeListener(event, listener));
    }

    protected defineRoute(method: HTTPMethod, path: string, options: DefineRouteOptions = {}): DefinedRoute {
        return <A, B>(
            originalData?: SendData<A>,
            auth?: AuthParams,
            pathParams: Record<string, string> = {}
        ): Promise<B> => {
            const { requiredParams = [], ...sendOptions } = options;

            /**
             * Sanitizes and ensures that the data is recreated as an object with default prototypes.
             * In rare cases if the data was created with `Object.create(null)` (no prototypes),
             * this will cause the data to be sent as `WebKitFormBoundary` instead of regular JSON object.
             *
             * Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create#custom_and_null_objects
             */
            const data = getObjectType(originalData) === "object" ? { ...originalData } : originalData;
            const url = compilePath(path, pathParams);

            // Validate required path parameters
            const firstMissingPathParam = url.match(/:([a-z]+)/gi)?.[0];
            if (firstMissingPathParam) {
                const error = fromError(new PathParameterError(firstMissingPathParam.replace(":", "")));
                return Promise.reject(error);
            }

            // Validate required body parameters
            const firstMissingParam = data ? requiredParams.find((key) => data[key] === undefined) : requiredParams[0];
            if (firstMissingParam) {
                const error = fromError(new RequestParameterError(firstMissingParam));
                return Promise.reject(error);
            }

            return this.api.send(method, url, data, auth, sendOptions) as Promise<B>;
        };
    }
}
