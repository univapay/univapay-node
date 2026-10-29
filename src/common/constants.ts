/**
 *  @internal
 *  @module Constants
 */

// `process` is undefined in browsers unless the bundler polyfills it
export const getEnv = (key: string): string | undefined =>
    typeof process === "undefined" ? undefined : process.env?.[key];

const parseInt = (str: string | undefined): number | undefined => {
    if (!str) return undefined;
    const parsed = Number.parseInt(str);

    return Number.isNaN(parsed) ? undefined : parsed;
};

export const DEFAULT_ENDPOINT = "https://api.univapay.com";
export const ENV_KEY_ENDPOINT = "UNIVAPAY_ENDPOINT";
export const ENV_KEY_APP_ID = "UNIVAPAY_APP_ID";
export const ENV_KEY_APPLICATION_JWT = "UNIVAPAY_APPLICATION_JWT";
export const ENV_KEY_SECRET = "UNIVAPAY_SECRET";
export const POLLING_TIMEOUT = parseInt(getEnv("POLLING_TIMEOUT")) ?? 600000; // 10 minutes
export const POLLING_INTERVAL = parseInt(getEnv("POLLING_INTERVAL")) ?? 1000; // 1 second
export const IDEMPOTENCY_KEY_HEADER = "Idempotency-Key";
export const MAX_INTERNAL_ERROR_RETRY = 3;
