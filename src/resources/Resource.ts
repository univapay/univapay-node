/**
 *  @internal
 *  @module Resources
 */
import decamelize from "decamelize";
import { EventEmitter } from "events";

import { AuthParams, HTTPMethod, ResponseCallback, RestAPI, SendData } from "../api/RestAPI";
import { fromError } from "../errors/parser";
import { PathParameterError } from "../errors/PathParameterError";
import { RequestParameterError } from "../errors/RequestParameterError";
import { missingKeys } from "../utils/object";

export type DefinedRoute = (
    data?: any,
    callback?: any,
    auth?: AuthParams,
    pathParams?: Record<string, string>
) => Promise<any>;

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

    protected defineRoute(
        method: HTTPMethod,
        path: string,
        required: string[] = [],
        requireAuth = true,
        acceptType?: string,
        keyFormatter = decamelize
    ): DefinedRoute {
        const api: RestAPI = this.api;

        return function route<A, B>(
            data?: SendData<A>,
            callback?: ResponseCallback<B>,
            auth?: AuthParams,
            pathParams: Record<string, string> = {}
        ): Promise<B> {
            const url: string = compilePath(path, pathParams);

            const missingPathParams: string[] = (url.match(/:([a-z]+)/gi) || []).map((m: string) => m.replace(":", ""));
            const missingParams: string[] = missingKeys(data, required);
            let err: Error;

            if (missingPathParams.length > 0) {
                err = fromError(new PathParameterError(missingPathParams[0]));
                callback?.(err);
                return Promise.reject(err);
            }

            if (missingParams.length > 0) {
                err = fromError(new RequestParameterError(missingParams[0]));
                callback?.(err);
                return Promise.reject(err);
            }

            return api.send(method, url, data, auth, callback, requireAuth, acceptType, keyFormatter);
        };
    }
}
