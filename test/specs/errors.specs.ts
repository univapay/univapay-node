import { expect } from "chai";

import { RequestErrorCode, ResponseErrorCode } from "../../src/errors/APIError";
import { RequestError, ResponseError } from "../../src/errors/RequestResponseError";

describe("Errors", () => {
    it("should serialize the ResponseError correctly", async () => {
        const error = new ResponseError({
            httpCode: 400,
            code: ResponseErrorCode.BadRequest,
            errors: [
                { reason: ResponseErrorCode.DBError },
                { reason: ResponseErrorCode.Forbidden, field: "my no reason field" },
            ],
        });

        expect(error.toString()).to.equal(
            "Error: Code: BAD_REQUEST, HttpCode: 400, Errors: DB_ERROR, FORBIDDEN (my no reason field)"
        );
    });

    it("should serialize the RequestError correctly", async () => {
        const error = new RequestError({
            httpCode: 400,
            code: RequestErrorCode.RequestError,
            errors: [
                { reason: RequestErrorCode.RequestError },
                { reason: RequestErrorCode.RequestError, field: "my no reason field" },
            ],
        });

        expect(error.toString()).to.equal(
            "Error: Code: REQUEST_ERROR, HttpCode: 400, Errors: REQUEST_ERROR, REQUEST_ERROR (my no reason field)"
        );
    });

    it("should serialize the ResponseError correctly", async () => {
        const error = new ResponseError({
            httpCode: 400,
            code: ResponseErrorCode.ValidationError,
            errors: [
                { reason: ResponseErrorCode.InvalidAmount },
                { reason: ResponseErrorCode.InvalidFormat, field: "dummy_field" },
            ],
        });

        expect(error.toString()).to.equal(
            "Error: Code: VALIDATION_ERROR, HttpCode: 400, Errors: INVALID_AMOUNT, INVALID_FORMAT (dummy_field)"
        );
    });

    it("should serialize an error with `errors` not being an array", async () => {
        const error = new RequestError({
            httpCode: 400,
            code: RequestErrorCode.RequestError,
            errors: { reason: RequestErrorCode.RequestError },
        });

        expect(error.toString()).to.equal("Error: Code: REQUEST_ERROR, HttpCode: 400, Errors: REQUEST_ERROR");
    });

    it("should serialize an error with `errors` using a symbol as error item", async () => {
        const error = new RequestError({
            httpCode: 400,
            code: RequestErrorCode.RequestError,
            errors: [RequestErrorCode.RequestError, "invalid code", 1, true],
        });

        expect(error.toString()).to.equal(
            "Error: Code: REQUEST_ERROR, HttpCode: 400, Errors: REQUEST_ERROR, UNKNOWN_ERROR, UNKNOWN_ERROR, UNKNOWN_ERROR"
        );
    });

    it("should serialize an error with `errors` having null and undefined values", async () => {
        const error = new RequestError({
            httpCode: 400,
            code: RequestErrorCode.RequestError,
            errors: [undefined, { reason: RequestErrorCode.RequestError }, null],
        });

        expect(error.toString()).to.equal("Error: Code: REQUEST_ERROR, HttpCode: 400, Errors: REQUEST_ERROR");
    });
});
