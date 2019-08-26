import { RequestError } from '../../src/errors/RequestResponseError';
import { ResponseErrorCode } from '../../src/errors/APIError';

export function createRequestError(fields: string[]): RequestError {
    return new RequestError({
        code: ResponseErrorCode.ValidationError,
        errors: fields.map((field: string) => ({ field, reason: ResponseErrorCode.RequiredValue })),
    });
}
