import { expect } from "chai";

import { fetchErrorReasons } from "../../../src/errors/RequestResponseError.js";
import { createRawErrorRequest } from "../../fixtures/errors.js";
import { ResponseErrorCode } from "../../../src/errors/APIError.js";

describe("Common > fetchErrorReasons", () => {
    it("should return reasons from errors", async () => {
        const data = createRawErrorRequest(ResponseErrorCode.ValidationError, [
            { field: "dummy-field", reason: ResponseErrorCode.NumberMin },
        ]);

        await expect(fetchErrorReasons(data)).equal([ResponseErrorCode.NumberMin]);
    });

    it("should return code when reasons are not provided", async () => {
        const data = createRawErrorRequest(ResponseErrorCode.BadRequest);

        await expect(fetchErrorReasons(data)).equal(ResponseErrorCode.BadRequest);
    });
});
