import { expect } from "chai";

import "../utils/index.js";

import { RestAPI } from "../../src/api/RestAPI.js";
import SDK from "../../src/index.js";
import { BankAccounts } from "../../src/resources/BankAccounts.js";
import { Cancels } from "../../src/resources/Cancels.js";
import { Captures } from "../../src/resources/Captures.js";
import { Charges } from "../../src/resources/Charges.js";
import { CheckoutInfo } from "../../src/resources/CheckoutInfo.js";
import { Ledgers } from "../../src/resources/Ledgers.js";
import { Merchants } from "../../src/resources/Merchants.js";
import { Refunds } from "../../src/resources/Refunds.js";
import { Stores } from "../../src/resources/Stores.js";
import { Subscriptions } from "../../src/resources/Subscriptions.js";
import { TransactionTokens } from "../../src/resources/TransactionTokens.js";
import { Transfers } from "../../src/resources/Transfers.js";
import { Verification } from "../../src/resources/Verification.js";
import { WebHooks } from "../../src/resources/WebHooks.js";

describe("SDK", () => {
    it("should have instances of all resources available", () => {
        const sdk = new SDK({ endpoint: "/" });

        const asserts: [string, unknown][] = [
            ["bankAccounts", BankAccounts],
            ["cancels", Cancels],
            ["captures", Captures],
            ["charges", Charges],
            ["checkoutInfo", CheckoutInfo],
            ["ledgers", Ledgers],
            ["merchants", Merchants],
            ["refunds", Refunds],
            ["stores", Stores],
            ["subscriptions", Subscriptions],
            ["transactionTokens", TransactionTokens],
            ["transfers", Transfers],
            ["verification", Verification],
            ["webHooks", WebHooks],
        ];

        expect(sdk).to.haveOwnProperty("api").which.is.an.instanceOf(RestAPI);

        for (const [name, ClassConstructor] of asserts) {
            expect(sdk)
                .to.have.haveOwnProperty(name)
                .which.is.an.instanceOf(ClassConstructor)
                .with.ownProperty("api")
                .equal(sdk.api);
        }
    });

    it("should add listener on the sdk", () => {
        const sdk = new SDK({ endpoint: "/" });

        const expectedPromise = new Promise((resolve) => sdk.addListener("test", () => resolve(true)));

        sdk.emit("test");

        expect(expectedPromise).to.eventually.be.fulfilled;
    });

    it("should add listener on the resource", () => {
        const sdk = new SDK({ endpoint: "/" });
        const resource = new WebHooks(sdk.api);

        const expectedPromise = new Promise((resolve) => resource.addListener("test", () => resolve(true)));

        resource.emit("test");

        expect(expectedPromise).to.eventually.be.fulfilled;
    });
});
