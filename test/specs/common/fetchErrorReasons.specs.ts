import { expect } from "chai";

import { fetchErrorReasons, formatErrors } from "../../../src/errors/RequestResponseError";
import { createRawErrorRequest } from "../../fixtures/errors";
import { ResponseErrorCode } from "../../../src/errors/APIError";

describe("Common > fetchErrorReasons", () => {
    it("should return reasons from errors", async () => {
        const data = createRawErrorRequest(ResponseErrorCode.ValidationError, [
            { field: "dummy-field", reason: ResponseErrorCode.NumberMin },
        ]);

        await expect(fetchErrorReasons(formatErrors(data))).equal([ResponseErrorCode.NumberMin]);
    });

    it("should return code when reasons are not provided", async () => {
        const data = createRawErrorRequest(ResponseErrorCode.BadRequest);

        await expect(fetchErrorReasons(formatErrors(data))).equal(ResponseErrorCode.BadRequest);
    });
});
