/**
 *  @internal
 *  @module Resources
 */
import { HTTPMethod, ResponseCallback, RestAPI, SendData } from "../api/RestAPI";
import { fromError } from "../errors/parser";
import { PathParameterError } from "../errors/PathParameterError";
import { RequestParameterError } from "../errors/RequestParameterError";
import { missingKeys } from "../utils/object";

export type DefinedRoute = (data?: any, callback?: any, pathParams?: string[], ...params: string[]) => Promise<any>;

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
function compilePath(path: string, pathParams: Record<string, any>): string {
    return path
        .replace(/\((\w|:|\/)+\)/gi, (o: string) => {
            const part: string = o.replace(/:(\w+)/gi, (s: string, p: string) => {
                return pathParams[p] || s;
            });
            return part.indexOf(":") === -1 ? part.replace(/\(|\)/g, "") : "";
        })
        .replace(/:(\w+)/gi, (s: string, p: string) => pathParams[p] || s);
}

export abstract class Resource {
    protected api: RestAPI;

    constructor(api: RestAPI) {
        this.api = api;
    }

    protected defineRoute(
        method: HTTPMethod,
        path: string,
        required: string[] = [],
        requireAuth = true,
        acceptType?: string
    ): DefinedRoute {
        const api: RestAPI = this.api;

        return function route<A, B>(
            data?: SendData<A>,
            callback?: ResponseCallback<B>,
            pathParams: string[] = [],
            ...params: string[]
        ): Promise<B> {
            const _params: any = params.reduce((p: any, param: string, i: number) => {
                if (pathParams && pathParams?.[i]) {
                    p[pathParams[i]] = param;
                }
                return p;
            }, {});

            const url: string = compilePath(path, _params);

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

            return api.send(method, url, data, callback, requireAuth, acceptType);
        };
    }
}
