import { expect } from "chai";
import JSONBig from "json-bigint";

import { APIError } from "../../src/errors/APIError";
import { checkStatus, parseJSON } from "../../src/utils/fetch";

const { stringify } = JSONBig({ useNativeBigInt: true });

const createResponse = (data: Record<string, unknown>, status = 200) =>
    new Response(stringify(data, null, 2), { status, statusText: "Dummy status" });

describe("Fetch Helpers", () => {
    describe("parseJSON", () => {
        it("return the parsed response body", async () => {
            const data = {
                key1: "Value 1",
                key2: { key21: "Value 2" },
                key3: 1234567890,
                key4: true,
                key5: { key51: "Value 51" },
                key6: [{ key61: "Value 61" }, 12345, false],
            };

            const result = await parseJSON(createResponse(data));

            expect(result).eql({
                key1: "Value 1",
                key2: { key21: "Value 2" },
                key3: 1234567890,
                key4: true,
                key5: { key51: "Value 51" },
                key6: [{ key61: "Value 61" }, 12345, false],
            });
        });

        it("return the parsed response body without formatting the keys in parameter", async () => {
            const result = await parseJSON(createResponse({ key1: "1", key2: "2", key3: { key_31: 1 } }), ["key3"]);

            expect(result).eql({ key1: "1", key2: "2", key3: { key_31: 1 } });
        });

        it("return the parsed response body with bigint", async () => {
            const result = await parseJSON(createResponse({ key1: 123456789101112131415n }), ["key3"]);

            expect(result).eql({ key1: 123456789101112131415n });
        });
    });

    describe("checkStatus", () => {
        it("return the response when the status is a success", () => {
            const response = createResponse({ key1: "1" }, 204);

            expect(checkStatus(response)).to.eventually.eql(response);
        });

        it("throws an error when the status is an error", () => {
            const response = createResponse({ key1: "1" }, 400);

            expect(checkStatus(response)).to.eventually.be.rejectedWith(new APIError(400, { key1: "1" }));
        });
    });
});
