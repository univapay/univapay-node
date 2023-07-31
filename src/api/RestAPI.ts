/**
 *  @module SDK/API
 */

import { stringify } from "@apimatic/json-bigint";
import { EventEmitter } from "events";
import pTimeout from "p-timeout";
import { stringify as stringifyQuery } from "query-string";
import flatten from "flat";

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
import { ResponseError } from "../errors/RequestResponseError.js";
import { TimeoutError } from "../errors/TimeoutError.js";
import { ProcessingMode } from "../resources/common/enums.js";
import { checkStatus, parseJSON } from "../utils/fetch.js";
import { isBlob, toSnakeCase, transformKeys } from "../utils/object.js";

import { extractJWT, JWTPayload, parseJWT } from "./utils/JWT.js";
import { containsBinaryData, objectToFormData } from "./utils/payload.js";
import { userAgent } from "./utils/userAgent.js";

export type PollParams<Response> = {
    /**
     * Condition for which the response is considered to be successful and stop the polling
     */
    successCondition: (response: Response) => boolean;

    /**
     * Condition to cancel the polling without triggering error
     */
    cancelCondition?: (response: Response) => boolean;

    /**
     * Time after which a TimeoutError will be triggered and the poll will be canceled
     */
    timeout?: number;

    /**
     * Interval between polls
     */
    interval?: number;

    /**
     * Callback to be triggered at each poll iteration
     */
    iterationCallback?: (response: Response) => void;
};

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
    handleUpdateJWT?: (jwt: string) => void;
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

export interface AuthParams {
    jwt?: string;
    secret?: string;
    idempotentKey?: string;
    origin?: string;

    // Deprecated
    authToken?: string;
    appId?: string;
}

export type PollData = {
    polling?: boolean;
};

export type PollExecute<A> = () => Promise<A>;

export type SendData<Data> = Data;

export type ApiSendOptions = {
    /**
     * Validate the JWT before calling the route and adds the authorization header to the request.
     */
    requireAuth?: boolean;

    /**
     * Add the custom type to the header. Defaults to `application/json`
     */
    acceptType?: string;

    /**
     * Custom formatter to format the request object to the API (skipped for blobs)
     */
    keyFormatter?: (key: string) => string;

    /**
     * List of key to ignore formatting on when parsing the response
     */
    ignoreKeysFormatting?: string[];
};

const getRequestBody = <Data>(
    data: SendData<Data>,
    keyFormatter = toSnakeCase,
    ignoreKeysFormatting: string[],
): string | FormData | Blob =>
    isBlob(data)
        ? data
        : containsBinaryData(data)
        ? objectToFormData(data, keyFormatter, ignoreKeysFormatting)
        : stringify(transformKeys(data, keyFormatter, ignoreKeysFormatting));

const stringifyParams = (data: unknown): string => {
    const query = stringifyQuery(flatten(transformKeys(data, toSnakeCase), { safe: true }), {
        arrayFormat: "bracket",
    });

    return query ? `?${query}` : "";
};

const execRequest = async <Response>(execute: () => Promise<Response>): Promise<Response> => {
    try {
        const response = await execute();

        return response;
    } catch (error) {
        const formattedError =
            error instanceof TimeoutError || error instanceof ResponseError ? error : fromError(error);

        throw formattedError;
    }
};

export class RestAPI extends EventEmitter {
    endpoint: string;
    jwt: JWTPayload<unknown>;
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

    protected handleUpdateJWT: (jwt: string) => void;

    constructor(options: RestAPIOptions = {}) {
        super();

        this.endpoint = options.endpoint || process.env[ENV_KEY_ENDPOINT] || DEFAULT_ENDPOINT;
        this.origin = options.origin || this.origin;
        this.jwtRaw = options.jwt || process.env[ENV_KEY_APPLICATION_JWT];
        this.handleUpdateJWT = options.handleUpdateJWT || undefined;

        this.appId = options.appId || process.env[ENV_KEY_APP_ID];
        this.secret = options.secret || process.env[ENV_KEY_SECRET];
        this.authToken = options.authToken;
    }

    set jwtRaw(jwtRaw: string) {
        this._jwtRaw = jwtRaw;
        this.jwt = parseJWT(jwtRaw);
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
        options: ApiSendOptions = {},
    ): Promise<ResponseBody | string | Blob | FormData> {
        const { acceptType, keyFormatter = toSnakeCase, ignoreKeysFormatting = ["metadata"] } = options;

        const payload: boolean = [HTTPMethod.GET, HTTPMethod.DELETE].includes(method) === false;

        const params: RequestInit = {
            headers: this.getHeaders(data, auth, payload, acceptType),
            method,
        };

        const request: Request = new Request(
            `${/^https?:\/\//.test(uri) ? uri : `${this.endpoint}${uri}`}${payload ? "" : stringifyParams(data)}`,
            payload ? { ...params, body: getRequestBody(data, keyFormatter, ignoreKeysFormatting) } : params,
        );

        this.emit("request", request);

        return execRequest<ResponseBody | string | Blob | FormData>(async () => {
            const response = await fetch(request);

            this.emit("response", response);

            const jwt = extractJWT(response);

            if (jwt) {
                this.jwtRaw = jwt;
                this.handleUpdateJWT?.(jwt);
            }

            await checkStatus(response);

            const noContentStatus = 204;
            if (response.status === noContentStatus) {
                return "";
            }

            const contentType = response.headers.get("content-type");
            if (contentType === "application/json") {
                return parseJSON<ResponseBody>(response, ignoreKeysFormatting);
            } else if (contentType) {
                if (contentType.indexOf("text/") === 0) {
                    return response.text();
                } else if (contentType.indexOf("multipart/") === 0) {
                    return response.formData();
                }
            }

            return response.blob();
        });
    }

    protected getHeaders<Data = unknown>(
        data: SendData<Data>,
        auth: AuthParams,
        payload: boolean,
        acceptType = "application/json",
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
    async longPolling<Response>(execute: PollExecute<Response>, pollParams: PollParams<Response>): Promise<Response> {
        const {
            successCondition,
            cancelCondition,
            iterationCallback,
            timeout = POLLING_TIMEOUT,
            interval = POLLING_INTERVAL,
        } = pollParams;

        return execRequest(async () => {
            let internalErrorCount = 0;

            const sleepInterval = () => new Promise((resolve) => setTimeout(resolve, interval));

            const repeater = async (): Promise<Response> => {
                try {
                    const result = await execute();

                    iterationCallback?.(result);

                    if (cancelCondition?.(result)) {
                        return null;
                    }

                    if (!successCondition(result)) {
                        await sleepInterval();
                        return repeater();
                    }

                    return result;
                } catch (error) {
                    // Use retry mechanism for 500 as internal server error on API side do not always mean failure
                    if (error.errorResponse?.httpCode !== 500 || internalErrorCount >= MAX_INTERNAL_ERROR_RETRY) {
                        throw error;
                    }

                    internalErrorCount++;
                    await sleepInterval();
                    return repeater();
                }
            };

            return pTimeout(repeater(), timeout, new TimeoutError(timeout));
        });
    }

    async ping(): Promise<void> {
        await this.send(HTTPMethod.GET, "/heartbeat", null, null, { requireAuth: false });
    }
}
