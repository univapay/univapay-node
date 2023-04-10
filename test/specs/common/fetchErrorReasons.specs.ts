import { expect } from "chai";

import { fetchErrorReasons } from "../../../src/errors/RequestResponseError.js";
import { createErrorResponse } from "../../fixtures/errors.js";
import { ResponseErrorCode } from "../../../src/errors/APIError.js";

describe("Common > fetchErrorReasons", () => {
    it("should return reasons from errors", async () => {
        const data = createErrorResponse(ResponseErrorCode.ValidationError, [
            { field: "dummy-field", reason: ResponseErrorCode.NumberMin },
        ]);

        await expect(fetchErrorReasons(data)).to.deep.equal([
            { field: "dummy-field", reason: ResponseErrorCode.NumberMin },
        ]);
    });

    it("should return code when reasons are not provided", async () => {
        const data = createErrorResponse(ResponseErrorCode.BadRequest);

        await expect(fetchErrorReasons(data)).to.deep.equal(ResponseErrorCode.BadRequest);
    });
});
