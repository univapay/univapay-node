/**
 *  @internal
 *  @module Resources
 */
import { RestAPI, HTTPMethod } from '../api/RestAPI';
export declare type DefinedRoute = (data?: any, callback?: any, pathParams?: string[], ...params: string[]) => Promise<any>;
export declare abstract class Resource {
    protected api: RestAPI;
    constructor(api: RestAPI);
    protected defineRoute(method: HTTPMethod, path: string, required?: string[], requireAuth?: boolean, acceptType?: string): DefinedRoute;
}
