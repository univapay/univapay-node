/**
 *  @module SDK/API
 */

import 'isomorphic-fetch';
import 'isomorphic-form-data';
import decamelize from 'decamelize';
import {
    DEFAULT_ENDPOINT,
    ENV_KEY_ENDPOINT,
    ENV_KEY_APP_ID,
    ENV_KEY_SECRET,
    POLLING_TIMEOUT,
    IDEMPOTENCY_KEY_HEADER,
} from '../common/constants';
import { transformKeys, omit } from '../utils/object';
import { checkStatus, parseJSON } from '../utils/fetch';
import { TimeoutError } from '../errors/TimeoutError';
import { fromError } from '../errors/parser';
import { stringify as stringifyQuery } from 'query-string';
import { ResponseErrorCode, RequestErrorCode } from '../errors/APIError';
import { extractJWT, JWTPayload, parseJWT } from './utils/JWT';
import { ProcessingMode } from '../resources/common/enums';
import { RequestError } from '../errors/RequestResponseError';
import { Omit } from 'type-zoo';
import { containsBinaryData, objectToFormData } from './utils/payload';

export enum HTTPMethod {
    GET = 'GET',
    POST = 'POST',
    PATCH = 'PATCH',
    PUT = 'PUT',
    DELETE = 'DELETE',
    OPTION = 'OPTION',
    HEAD = 'HEAD',
}

export interface RestAPIOptions {
    endpoint?: string;
    jwt?: string;
    handleUpdateJWT?(jwt: string): void;
    secret?: string;
    origin?: string;

    // Deprecated
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

export type ResponseCallback<A> = (response: A | Error) => void;

export type PromiseResolve<A> = (value?: A | PromiseLike<A>) => void;
export type PromiseReject = (reason?: any) => void;

export interface AuthParams {
    jwt?: string;
    secret?: string;

    // Deprecated
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

const internalParams: (keyof AuthParams | keyof IdempotentParams | keyof OriginParams)[] = [
    'appId',
    'secret',
    'authToken',
    'jwt',
    'idempotentKey',
    'origin',
];

export type PromiseCreator<A> = () => Promise<A>;

export type SendData<Data> = Data & AuthParams & IdempotentParams & OriginParams;

function getData<Data extends object>(
    data: SendData<Data>,
): Omit<Data, keyof AuthParams | keyof IdempotentParams | keyof OriginParams> {
    return omit(data, internalParams);
}

function getRequestBody<Data>(data: SendData<Data>): string | FormData {
    return containsBinaryData(data) ? objectToFormData(data) : JSON.stringify(transformKeys(data, decamelize));
}

function getIdempotencyKey<Data>(data: SendData<Data>): string | null {
    return typeof data === 'object' && !!data ? data.idempotentKey : null;
}

function getOrigin<Data>(data: SendData<Data>): string | null {
    return typeof data === 'object' && !!data ? data.origin : null;
}

function stringifyParams<Data extends object>(data: Data): string {
    const query = stringifyQuery(transformKeys(data, decamelize), { arrayFormat: 'bracket' });
    return query ? `?${query}` : '';
}

async function execRequest<A>(executor: () => Promise<A>, callback?: ResponseCallback<A>): Promise<A> {
    try {
        const response = await executor();
        if (typeof callback === 'function') {
            callback(response);
        }
        return response;
    } catch (error) {
        const err: Error = error instanceof TimeoutError ? error : fromError(error);
        if (typeof callback === 'function') {
            callback(err);
        }
        throw err;
    }
}

export class RestAPI {
    endpoint: string;
    jwt: JWTPayload<any>;
    protected handleUpdateJWT: (jwt: string) => void = () => undefined;
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

    private _jwtRaw: string = null;

    constructor(options: RestAPIOptions = {}) {
        this.endpoint = options.endpoint || process.env[ENV_KEY_ENDPOINT] || DEFAULT_ENDPOINT;
        this.origin = options.origin || this.origin;
        this.jwtRaw = options.jwt;

        if (options.handleUpdateJWT && typeof options.handleUpdateJWT === 'function') {
            this.handleUpdateJWT = options.handleUpdateJWT;
        }

        this.appId = options.appId || process.env[ENV_KEY_APP_ID];
        this.secret = options.secret || process.env[ENV_KEY_SECRET];
        this.authToken = options.authToken;
    }

    set jwtRaw(jwtRaw: string) {
        this.jwt = parseJWT(jwtRaw);
        this._jwtRaw = jwtRaw;
    }

    get jwtRaw(): string | null {
        return this._jwtRaw;
    }

    /**
     * @internal
     */
    async send<A, Data = any>(
        method: HTTPMethod,
        uri: string,
        data?: SendData<Data>,
        callback?: ResponseCallback<A>,
        requireAuth: boolean = true,
        acceptType?: string,
    ): Promise<A> {
        const dateNow = new Date();
        const timestampUTC = Math.round(dateNow.getTime() / 1000);

        if (requireAuth && this._jwtRaw && this.jwt.exp < timestampUTC) {
            throw new RequestError({
                code: ResponseErrorCode.ExpiredLoginToken,
                errors: [],
            });
        }

        const payload: boolean = [HTTPMethod.GET, HTTPMethod.DELETE].indexOf(method) === -1;

        const params: RequestInit = {
            headers: this.getHeaders(data, payload, acceptType),
            method,
        };

        const requestData = getData(data);
        const request: Request = new Request(
            `${this.endpoint}${uri}${payload ? '' : stringifyParams(requestData)}`,
            payload ? { ...params, body: getRequestBody(requestData) } : params,
        );

        return await execRequest(async () => {
            const response = await fetch(request);
            const jwt = await extractJWT(response);

            if (jwt) {
                this.jwtRaw = jwt;
                this.handleUpdateJWT(jwt);
            }

            await checkStatus(response);

            const contentType = response.headers.get('content-type');
            if (contentType === 'application/json') {
                return await parseJSON(response);
            } else if (contentType) {
                if (contentType.indexOf('text/') === 0) {
                    return await response.text();
                } else if (contentType.indexOf('multipart/') === 0) {
                    return await response.formData();
                }
            }

            return await response.blob();
        }, callback);
    }

    protected getHeaders<Data extends object>(
        data: SendData<Data>,
        payload: boolean,
        acceptType: string = 'application/json',
    ): Headers {
        const headers: Headers = new Headers();
        const isFormData = containsBinaryData(data);

        headers.append('Accept', acceptType);

        if (!isFormData && payload) {
            headers.append('Content-Type', 'application/json');
        }

        const origin = getOrigin(data) || this.origin;
        if (origin) {
            headers.append('Origin', origin);
        }

        const idempotentKey = getIdempotencyKey(data);
        if (idempotentKey) {
            headers.append(IDEMPOTENCY_KEY_HEADER, idempotentKey);
        }

        // Deprecated
        const { authToken = this.authToken, appId = this.appId, secret = this.secret, jwt = this._jwtRaw } = {
            ...(!isFormData ? data : {}),
        };

        if (authToken) {
            headers.append('Authorization', `Token ${authToken}`);
        } else if (appId) {
            headers.append('Authorization', `ApplicationToken ${appId}|${secret || ''}`);
        } else if (jwt) {
            if (secret) {
                headers.append('Authorization', `Bearer ${secret}.${jwt}`);
            } else {
                headers.append('Authorization', `Bearer ${jwt}`);
            }
        }

        return headers;
    }

    /**
     * @internal
     */
    async longPolling<A>(
        promise: PromiseCreator<A>,
        condition: (response: A) => boolean,
        callback?: ResponseCallback<A>,
        timeout: number = POLLING_TIMEOUT,
    ): Promise<A> {
        return await execRequest(async () => {
            let timedOut = false;

            return Promise.race([
                // Timeout
                new Promise<A>((_, reject) => {
                    setTimeout(() => {
                        timedOut = true;
                        reject(new TimeoutError(timeout));
                    }, timeout);
                }),
                // Repeater
                (async function repeater(): Promise<A> {
                    const result = await promise();

                    if (!timedOut && !condition(result)) {
                        return await repeater();
                    }

                    return result;
                })(),
            ]);
        }, callback);
    }

    async ping(callback?: ResponseCallback<void>): Promise<void> {
        await this.send(HTTPMethod.GET, '/heartbeat', null, callback, false);
    }
}
