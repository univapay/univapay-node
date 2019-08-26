/**
 *  @module SDK/API
 */
import 'isomorphic-fetch';
import 'isomorphic-form-data';
import { ResponseErrorCode, RequestErrorCode } from '../errors/APIError';
import { JWTPayload } from './utils/JWT';
import { ProcessingMode } from '../resources/common/enums';
export declare enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
    OPTION = "OPTION",
    HEAD = "HEAD"
}
export interface RestAPIOptions {
    endpoint?: string;
    jwt?: string;
    handleUpdateJWT?(jwt: string): void;
    secret?: string;
    origin?: string;
    authToken?: string;
    appId?: string;
}
export interface ApplicationToken {
    sub: 'app_token';
}
export interface StoreToken extends ApplicationToken {
    storeId: string;
    mode: ProcessingMode;
    domains: string[];
}
export interface SubError {
    reason: RequestErrorCode | ResponseErrorCode;
}
export interface ValidationError extends SubError {
    field: string;
}
export interface ErrorResponse {
    httpCode?: number;
    status: string;
    code: ResponseErrorCode | RequestErrorCode;
    errors: (SubError | ValidationError)[];
}
export declare type ResponseCallback<A> = (response: A | Error) => void;
export declare type PromiseResolve<A> = (value?: A | PromiseLike<A>) => void;
export declare type PromiseReject = (reason?: any) => void;
export interface AuthParams {
    jwt?: string;
    secret?: string;
    authToken?: string;
    appId?: string;
}
export interface PollParams {
    polling?: boolean;
}
export interface IdempotentParams {
    idempotentKey?: string;
}
export interface OriginParams {
    origin?: string;
}
export declare type PromiseCreator<A> = () => Promise<A>;
export declare type SendData<Data> = Data & AuthParams & IdempotentParams & OriginParams;
export declare class RestAPI {
    endpoint: string;
    jwt: JWTPayload<any>;
    protected handleUpdateJWT: (jwt: string) => void;
    secret: string;
    origin: string;
    /**
     *  @deprecated
     */
    appId: string;
    /**
     *  @deprecated
     */
    authToken: string;
    private _jwtRaw;
    constructor(options?: RestAPIOptions);
    jwtRaw: string;
    /**
     * @internal
     */
    send<A, Data = any>(method: HTTPMethod, uri: string, data?: SendData<Data>, callback?: ResponseCallback<A>, requireAuth?: boolean, acceptType?: string): Promise<A>;
    protected getHeaders<Data extends object>(data: SendData<Data>, payload: boolean, acceptType?: string): Headers;
    /**
     * @internal
     */
    longPolling<A>(promise: PromiseCreator<A>, condition: (response: A) => boolean, callback?: ResponseCallback<A>, timeout?: number): Promise<A>;
    ping(callback?: ResponseCallback<void>): Promise<void>;
}
