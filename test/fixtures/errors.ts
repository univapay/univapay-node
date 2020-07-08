import { ResponseErrorCode } from "../../src/errors/APIError";
import { RequestError } from "../../src/errors/RequestResponseError";

export const createRequestError = (fields: string[]): RequestError => {
    return new RequestError({
        code: ResponseErrorCode.ValidationError,
        errors: fields.map((field: string) => ({ field, reason: ResponseErrorCode.RequiredValue })),
    });
};
