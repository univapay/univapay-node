import { stringify } from "@apimatic/json-bigint";
import { expect } from "chai";

import { APIError } from "../../src/errors/APIError.js";
import { checkStatus, parseJSON } from "../../src/utils/fetch.js";

const createResponse = (data: Record<string, unknown>, status = 200) =>
    new Response(status === 204 ? null : stringify(data, null, 2), { status, statusText: "Dummy status" });

describe("Fetch Helpers", () => {
    describe("parseJSON", () => {
        it("return the parsed response body", async () => {
            const data = {
                key1: "Value 1",
                key2: { key21: "Value 2" },
                key3: 1234567890,
                key4: true,
                key5: { key51: "Value 51" },
                key6: [{ key61: "Value 61" }, 12345, false, null],
                key7: false,
                key8: null,
            };

            const result = await parseJSON(createResponse(data));

            expect(result).eql(data);
        });

        it("return the parsed response body without formatting the keys in parameter", async () => {
            const result = await parseJSON(createResponse({ key1: "1", key2: "2", key3: { key_31: 1 } }), ["key3"]);

            expect(result).eql({ key1: "1", key2: "2", key3: { key_31: 1 } });
        });

        it("return the parsed response body with bigint", async () => {
            const result = await parseJSON(
                createResponse({ key1: BigInt("123456789101112131415"), key2: [BigInt("123456789101112131415")] }),
            );

            expect(result).eql({ key1: BigInt("123456789101112131415"), key2: [BigInt("123456789101112131415")] });
        });

        it("return the parsed response body with float", async () => {
            const result = await parseJSON(createResponse({ key1: 12345678910.11121, key2: [12345678910.11121] }));

            expect(result).eql({ key1: 12345678910.11121, key2: [12345678910.11121] });
        });
    });

    describe("checkStatus", () => {
        it("return the response when the status is a success", async () => {
            const response = createResponse({ key1: "1" }, 204);

            await expect(checkStatus(response)).to.become(response);
        });

        it("throws an error when the status is an error", async () => {
            const response = createResponse({ key1: "1" }, 400);

            await expect(checkStatus(response)).to.be.rejectedWith(APIError, "API request failed with status 400");
        });
    });
});
