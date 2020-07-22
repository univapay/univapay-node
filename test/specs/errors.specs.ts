import { expect } from "chai";

import { RequestErrorCode, ResponseErrorCode } from "../../src/errors/APIError";
import { RequestError, ResponseError } from "../../src/errors/RequestResponseError";

describe("Errors", () => {
    it("should serialize ResponseError correctly", async () => {
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

    it("should serialize RequestError correctly", async () => {
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
});
