import { expect } from "chai";
import sinon from "sinon";

import { ResponseErrorCode } from "../../../src/errors/APIError.js";
import { ResponseError } from "../../../src/errors/RequestResponseError.js";
import { ignoreDescriptor } from "../../../src/resources/common/ignoreDescriptor.js";

describe("Common > Ignore descriptor", () => {
    it("should use descriptor on request", async () => {
        const data = { descriptor: "dummy-descriptor" };
        const execute = sinon.stub().callsFake((data) => data);

        await expect(ignoreDescriptor(execute, data)).to.eventually.eql(data);
    });

    it("should query again without descriptor with descriptor error", async () => {
        const data = { descriptor: "dummy-descriptor" };
        const execute = sinon.stub().callsFake((data) => {
            if (!data.descriptor) {
                return data;
            }

            throw new ResponseError({
                code: ResponseErrorCode.ValidationError,
                httpCode: 400,
                errors: [{ field: "descriptor", reason: ResponseErrorCode.NotSupportedByProcessor }],
            });
        });

        await expect(ignoreDescriptor(execute, data)).to.eventually.eql({});
    });

    it("should throw error with other errors", async () => {
        const data = { descriptor: "dummy-descriptor" };
        const execute = sinon.stub().callsFake(() => {
            throw new ResponseError({
                code: ResponseErrorCode.ValidationError,
                httpCode: 400,
                errors: [{ field: "test", reason: ResponseErrorCode.InvalidFormat }],
            });
        });

        await expect(ignoreDescriptor(execute, data)).to.eventually.be.rejected;
    });
});
