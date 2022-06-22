/**
 *  @module SDK/API
 */

import { stringify } from "@apimatic/json-bigint";
import { EventEmitter } from "events";
import pTimeout from "p-timeout";
import { stringify as stringifyQuery } from "query-string";

import {
    DEFAULT_ENDPOINT,
    ENV_KEY_APP_ID,
    ENV_KEY_APPLICATION_JWT,
    ENV_KEY_ENDPOINT,
    ENV_KEY_SECRET,
    IDEMPOTENCY_KEY_HEADER,
    POLLING_INTERVAL,
    POLLING_TIMEOUT,
    MAX_INTERNAL_ERROR_RETRY,
} from "../common/constants.js";
import { RequestErrorCode, ResponseErrorCode } from "../errors/APIError.js";
import { fromError } from "../errors/parser.js";
import { RequestError } from "../errors/RequestResponseError.js";
import { TimeoutError } from "../errors/TimeoutError.js";
import { ProcessingMode } from "../resources/common/enums.js";
import { checkStatus, parseJSON } from "../utils/fetch.js";
import { isBlob, toSnakeCase, transformKeys } from "../utils/object.js";

import { extractJWT, JWTPayload, parseJWT } from "./utils/JWT.js";
import { containsBinaryData, objectToFormData } from "./utils/payload.js";
import { userAgent } from "./utils/userAgent.js";

export enum HTTPMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
    OPTION = "OPTION",
    HEAD = "HEAD",
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
    sub: "app_token";
}

export interface StoreToken extends ApplicationToken {
    storeId: string;
    mode: ProcessingMode;
    domains: string[];
}

export interface SubError {
    reason: RequestErrorCode | ResponseErrorCode;
    rawError?: boolean | number | string | SubError | ValidationError;
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
    idempotentKey?: string;
    origin?: string;

    // Deprecated
    authToken?: string;
    appId?: string;
}

export interface PollParams {
    polling?: boolean;
}

export type PromiseCreator<A> = () => Promise<A>;

export type SendData<Data> = Data;

const getRequestBody = <Data>(data: SendData<Data>, keyFormatter = toSnakeCase): string | FormData | Blob =>
    isBlob(data)
        ? data
        : containsBinaryData(data)
        ? objectToFormData(data, keyFormatter, ["metadata"])
        : stringify(transformKeys(data, keyFormatter, ["metadata"]));

const stringifyParams = <Data extends Record<string, any>>(data: Data): string => {
    const query = stringifyQuery(transformKeys(data, toSnakeCase), { arrayFormat: "bracket" });

    return query ? `?${query}` : "";
};

const execRequest = async <A>(executor: () => Promise<A>, callback?: ResponseCallback<A>): Promise<A> => {
    try {
        const response = await executor();
        if (typeof callback === "function") {
            callback(response);
        }

        return response;
    } catch (error) {
        const err: Error = error instanceof TimeoutError ? error : fromError(error);
        if (typeof callback === "function") {
            callback(err);
        }

        throw err;
    }
};

export class RestAPI extends EventEmitter {
    endpoint: string;
    jwt: JWTPayload<any>;
    origin: string;
    secret: string;

    /**
     *  @deprecated
     */
    appId: string;

    /**
     *  @deprecated
     */
    authToken: string;

    private _jwtRaw: string = null;

    protected handleUpdateJWT: (jwt: string) => void = () => undefined;

    constructor(options: RestAPIOptions = {}) {
        super();

        this.endpoint = options.endpoint || process.env[ENV_KEY_ENDPOINT] || DEFAULT_ENDPOINT;
        this.origin = options.origin || this.origin;
        this.jwtRaw = options.jwt || process.env[ENV_KEY_APPLICATION_JWT];

        if (options.handleUpdateJWT && typeof options.handleUpdateJWT === "function") {
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
    async send<ResponseBody, Data = unknown>(
        method: HTTPMethod,
        uri: string,
        data?: SendData<Data>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseBody>,
        requireAuth = true,
        acceptType?: string,
        keyFormatter = toSnakeCase
    ): Promise<ResponseBody | string | Blob | FormData> {
        const dateNow = new Date();
        const timestampUTC = Math.round(dateNow.getTime() / 1000);

        if (requireAuth && this._jwtRaw && this.jwt.exp < timestampUTC) {
            throw new RequestError({
                code: ResponseErrorCode.ExpiredLoginToken,
                errors: [],
            });
        }

        const payload: boolean = [HTTPMethod.GET, HTTPMethod.DELETE].includes(method) === false;

        const params: RequestInit = {
            headers: this.getHeaders(data, auth, payload, acceptType),
            method,
        };

        const request: Request = new Request(
            `${/^https?:\/\//.test(uri) ? uri : `${this.endpoint}${uri}`}${payload ? "" : stringifyParams(data)}`,
            payload ? { ...params, body: getRequestBody(data, keyFormatter) } : params
        );

        this.emit("request", request);

        return execRequest<ResponseBody | string | Blob | FormData>(async () => {
            const response = await fetch(request);

            this.emit("response", response);

            const jwt = extractJWT(response);

            if (jwt) {
                this.jwtRaw = jwt;
                this.handleUpdateJWT(jwt);
            }

            await checkStatus(response);

            const noContentStatus = 204;
            if (response.status === noContentStatus) {
                return "";
            }

            const contentType = response.headers.get("content-type");
            if (contentType === "application/json") {
                return parseJSON<ResponseBody>(response, ["metadata"]);
            } else if (contentType) {
                if (contentType.indexOf("text/") === 0) {
                    return response.text();
                } else if (contentType.indexOf("multipart/") === 0) {
                    return response.formData();
                }
            }

            return response.blob();
        }, callback);
    }

    protected getHeaders<Data extends Record<string, any>>(
        data: SendData<Data>,
        auth: AuthParams,
        payload: boolean,
        acceptType = "application/json"
    ): Headers {
        const headers: Headers = new Headers();
        const isFormData = containsBinaryData(data);

        headers.append("Accept", acceptType);

        if (!isFormData && payload) {
            headers.append("Content-Type", "application/json");
        }

        const {
            origin = this.origin,
            idempotentKey = null,
            authToken = this.authToken,
            appId = this.appId,
            secret = this.secret,
            jwt = this.jwtRaw,
        } = auth || {};

        headers.append("User-Agent", userAgent());

        if (origin) {
            headers.append("Origin", origin);
        }

        if (idempotentKey) {
            headers.append(IDEMPOTENCY_KEY_HEADER, idempotentKey);
        }

        if (authToken) {
            headers.append("Authorization", `Token ${authToken}`);
        } else if (appId) {
            headers.append("Authorization", `ApplicationToken ${appId}|${secret || ""}`);
        } else if (jwt) {
            if (secret) {
                headers.append("Authorization", `Bearer ${secret}.${jwt}`);
            } else {
                headers.append("Authorization", `Bearer ${jwt}`);
            }
        }

        return headers;
    }

    /**
     * @internal
     */
    async longPolling<Response>(
        /**
         * API call to be repeated
         */
        promise: PromiseCreator<Response>,

        /**
         * Condition for which the response is considered to be successful and stop the polling
         */
        successCondition: (response: Response) => boolean,

        /**
         * Condition to cancel the polling without triggering error
         */
        cancelCondition?: (response: Response) => boolean,

        /**
         * Callback to be triggered at the end of the long polling
         */
        callback?: ResponseCallback<Response>,

        /**
         * Time after which a TimeoutError will be triggered and the poll will be canceled
         */
        timeout: number = POLLING_TIMEOUT,

        /**
         * Interval between polls
         */
        interval: number = POLLING_INTERVAL,

        /**
         * Callback to be triggered at each poll iteration
         */
        iterationCallback?: (response: Response) => void
    ): Promise<Response> {
        return execRequest(async () => {
            let internalErrrorCount = 0;

            const repeater = async (): Promise<Response> => {
                try {
                    const result = await promise();

                    iterationCallback?.(result);

                    if (cancelCondition?.(result)) {
                        return null;
                    }

                    if (!successCondition(result)) {
                        await new Promise((resolve) => setTimeout(resolve, interval)); // sleep to avoid firing requests too fast
                        return repeater();
                    }

                    return result;
                } catch (error) {
                    if (error.httpCode !== 500 || internalErrrorCount === MAX_INTERNAL_ERROR_RETRY) {
                        throw error;
                    }

                    internalErrrorCount++;
                    return repeater();
                }
            };

            return pTimeout(repeater(), timeout, new TimeoutError(timeout));
        }, callback);
    }

    async ping(callback?: ResponseCallback<void>): Promise<void> {
        await this.send(HTTPMethod.GET, "/heartbeat", null, null, callback, false);
    }
}
