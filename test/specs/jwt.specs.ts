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
            "e.e./e",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE1MjAyMzQ0NDZ9",
        ];

        const parseSpy = sandbox.spy(parseJWT);

        for (const assert of asserts) {
            expect(() => parseSpy(assert)).to.throw(JWTError);
        }
    });

    it("should extract JWT from HTTP headers preferring the refresh token update", () => {
        const jwtToken1 = jwt.sign({ foo: "bar" }, "foo");
        const jwtToken2 = jwt.sign({ foo: "bar2" }, "foo2");

        const headers = new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken1}`,
            "x-amzn-remapped-authorization": "Bearer invalid",
            "X-REFRESH-AUTHORIZATION": jwtToken2,
        });

        expect(extractJWT(new Response("foo", { headers }))).to.equal(jwtToken2);
    });

    it("should extract JWT from HTTP headers preferring the string without Bearer keyword", () => {
        const jwtToken = jwt.sign({ foo: "bar" }, "foo");
        const headers = new Headers({ Authorization: jwtToken, "Content-Type": "application/json" });

        expect(extractJWT(new Response("foo", { headers }))).to.equal(jwtToken);
    });

    it("should not extract JWT from HTTP when correct headers are not provided", () => {
        const headers = new Headers({ "Content-Type": "application/json" });

        expect(extractJWT(new Response("foo", { headers }))).to.equal(null);
    });

    it("should not extract JWT from HTTP when the token is invalid", () => {
        const headers = new Headers({
            "Content-Type": "application/json",
            "x-amzn-remapped-authorization": "Bearer invalid",
            "X-REFRESH-AUTHORIZATION": "fooo!",
        });

        expect(extractJWT(new Response("foo", { headers }))).to.equal(null);
    });
});
