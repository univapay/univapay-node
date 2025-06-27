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
     * Interval between polls or function to compute the interval
     */
    interval?: number | (() => number);

    /**
     * Callback to be triggered at each poll iteration
     */
    iterationCallback?: (response: Response) => void;

    /**
     * Boolean when the call should not be executed when the tab is inactive. Defaults to false.
     * Only works on a valid webbrowser environment
     */
    browserSkipCallForInactiveTabs?: boolean;
};

export type BodyTransferType = "entity" | "message";

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
    authParams?: DefaultAuthParams;

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
    useCredentials?: boolean;

    // Deprecated
    authToken?: string;
    appId?: string;
}

export type DefaultAuthParams = {
    useCredentials?: boolean;
};

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

    /**
     * Overrides default body transfer encoding of the request.
     *
     * Note: Can not for GET and HEAD request
     *
     * Default is "message-body" for DELETE, HEAD and GET and "entity-body" for all other call methods.
     */
    bodyTransferEncoding?: BodyTransferType;

    /**
     * Some of the services require query impersonate to be present.
     */
    queryImpersonate?: string;

    /**
     * Fetch request init parameters
     *
     * Using `redirect` as `manual` will automatically do the redirect from the SDK to preserve the origin
     */
    requestInit?: RequestInit;

    /**
     * Boolean when debug logs should be shown for debugging purpose
     */
    debug?: boolean;
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

    defaultAuthParams?: DefaultAuthParams;

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
        this.defaultAuthParams = options.authParams;

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
        const authParams = { ...this.defaultAuthParams, ...auth };
        const {
            acceptType,
            keyFormatter = toSnakeCase,
            ignoreKeysFormatting = ["metadata"],
            bodyTransferEncoding,
            queryImpersonate,
            requestInit,
        } = options;

        const payload: boolean =
            bodyTransferEncoding === "entity"
                ? ![HTTPMethod.GET, HTTPMethod.HEAD].includes(method)
                : bodyTransferEncoding === "message"
                  ? false
                  : ![HTTPMethod.GET, HTTPMethod.HEAD, HTTPMethod.DELETE].includes(method);

        const params: RequestInit = {
            headers: this.getHeaders(data, authParams, payload, acceptType),
            method,
            ...(authParams?.useCredentials ? { credentials: "include" } : {}),
        };

        const query = stringifyParams({
            ...(payload || !data ? {} : data),
            ...(queryImpersonate ? { impersonate: queryImpersonate } : {}),
        });
        const request: Request = new Request(
            `${/^https?:\/\//.test(uri) ? uri : `${this.endpoint}${uri}`}${query}`,
            payload ? { ...params, body: getRequestBody(data, keyFormatter, ignoreKeysFormatting) } : params,
        );

        this.emit("request", request);

        const debug = options.debug ? (execute: () => void) => execute() : () => undefined;

        return execRequest<ResponseBody | string | Blob | FormData>(async () => {
            debug(() => console.info(`Excecuting ${method} ${uri}`, data, auth, options));
            const response = await fetch(request, requestInit);
            debug(() => console.info("Executed with response", response));

            this.emit("response", response);

            const jwt = extractJWT(response);

            if (jwt) {
                debug(() => console.info("Refresh jwt", jwt));
                this.jwtRaw = jwt;
                this.handleUpdateJWT?.(jwt);
            }

            const noContentStatus = 204;
            if (response.status === noContentStatus) {
                debug(() => console.info("No body status found. Early returns body as empty."));
                return "";
            }

            const redirect = response.headers.get("location");
            if (response.redirected === false && redirect && options?.requestInit?.redirect === "manual") {
                debug(() => console.info(`Redirecting to ${redirect} after 303 call`, response.headers));
                return this.send(method, redirect, data, auth, options);
            } else {
                debug(() => console.info("Validating response status", response.status));
                await checkStatus(response);
                debug(() => console.info("Validated response status", response.status));
            }

            const contentType = response.headers.get("content-type");
            debug(() => console.info(`Parsing body with content type ${contentType}`, response.headers));
            if (contentType) {
                if (contentType.indexOf("application/json") !== -1) {
                    return parseJSON<ResponseBody>(response, ignoreKeysFormatting);
                } else if (contentType.indexOf("text/") === 0) {
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
            browserSkipCallForInactiveTabs = false,
        } = pollParams;

        return execRequest(async () => {
            let internalErrorCount = 0;

            const computedInterval = typeof interval === "number" ? interval : interval();
            const sleepInterval = () => new Promise((resolve) => setTimeout(resolve, computedInterval));

            const repeater = async (): Promise<Response> => {
                if (browserSkipCallForInactiveTabs && document?.hidden) {
                    await sleepInterval();
                    return repeater();
                }

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
