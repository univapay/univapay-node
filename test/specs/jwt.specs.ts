import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon, { SinonSandbox } from "sinon";

import { extractJWT, parseJWT } from "../../src/api/utils/JWT.js";
import { JWTError } from "../../src/errors/JWTError.js";

describe("JWT", () => {
    let sandbox: SinonSandbox;

    beforeEach(() => {
        sandbox = sinon.createSandbox({
            properties: ["spy", "clock"],
        });
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should parse JWT data", () => {
        const jwtTokenPayload = { foo_bar: "test" };
        const jwtTokenPayloadCamel = { fooBar: "test" };
        const jwtToken = jwt.sign(jwtTokenPayload, "foo");

        expect(parseJWT(jwtToken)).to.contain(jwtTokenPayloadCamel);
        expect(parseJWT(jwtToken, true)).to.contain(jwtTokenPayload);

        for (const empty of [null, undefined, ""]) {
            expect(parseJWT(empty)).to.be.null;
        }
    });

    it("should return parsing error", () => {
        const asserts = [
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1MjAyMzQ0NDZ9",
        ];

        const parseSpy = sandbox.spy(parseJWT);

        for (const assert of asserts) {
            expect(() => {
                parseSpy(assert);
            }).to.throw(JWTError);
        }
    });

    it("should extract JWT from HTTP headers", () => {
        const jwtToken = jwt.sign({ foo: "bar" }, "foo");

        const asserts: [Headers, string][] = [
            [new Headers({ "Content-Type": "application/json" }), null],
            [new Headers({ Authorization: `Bearer ${jwtToken}`, "Content-Type": "application/json" }), jwtToken],
        ];

        for (const [headers, expectation] of asserts) {
            expect(extractJWT(new Response("foo", { headers }))).to.equal(expectation);
        }
    });
});
