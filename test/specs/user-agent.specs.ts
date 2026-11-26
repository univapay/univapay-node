import { expect } from "chai";

import { userAgent } from "../../src/api/utils/userAgent.js";

describe("User agent", () => {
    it("should identify the module type as ESM", () => {
        expect(userAgent()).to.equal(`univapay-node node.js@${process.versions.node} module`);
    });

    it("should identify the module type as CommonJS when require is defined", () => {
        Object.defineProperty(globalThis, "require", { value: () => undefined, configurable: true });

        try {
            expect(userAgent()).to.equal(`univapay-node node.js@${process.versions.node} commonjs`);
        } finally {
            delete (globalThis as { require?: unknown }).require;
        }
    });
});
