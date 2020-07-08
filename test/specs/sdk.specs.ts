import { expect } from "chai";

import "../utils";

import { RestAPI } from "../../src/api/RestAPI";
import SDK from "../../src/index";
import { BankAccounts } from "../../src/resources/BankAccounts";
import { Cancels } from "../../src/resources/Cancels";
import { Captures } from "../../src/resources/Captures";
import { Charges } from "../../src/resources/Charges";
import { CheckoutInfo } from "../../src/resources/CheckoutInfo";
import { Ledgers } from "../../src/resources/Ledgers";
import { Merchants } from "../../src/resources/Merchants";
import { Refunds } from "../../src/resources/Refunds";
import { Stores } from "../../src/resources/Stores";
import { Subscriptions } from "../../src/resources/Subscriptions";
import { TransactionTokens } from "../../src/resources/TransactionTokens";
import { Transfers } from "../../src/resources/Transfers";
import { Verification } from "../../src/resources/Verification";
import { WebHooks } from "../../src/resources/WebHooks";

describe("SDK", () => {
    it("should have instances of all resources available", () => {
        const sdk = new SDK({ endpoint: "/" });

        const asserts: [string, any][] = [
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
});
