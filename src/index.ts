/**
 *  @module SDK
 */

import { RestAPIOptions } from "./api/RestAPI";
import { ECInfo } from "./resources/ECInfo";
import { WebHookTrigger as PublicWebHookTrigger } from "./resources/WebHooks";
import {
    BankAccounts,
    Cancels,
    Captures,
    Charges,
    CheckoutInfo,
    ECFormLinks,
    ECForms,
    Emails,
    ExchangeRates,
    Ledgers,
    Merchants,
    Platforms,
    Refunds,
    Stores,
    Subscriptions,
    TransactionTokens,
    Transfers,
    Verification,
    WebHooks,
} from "./resources";
import PaymentsSDK from "./sdk";

export * from "./api";
export * from "./common";
export * from "./errors";
export * from "./resources";
export * from "./utils";
export const BaseSDK = PaymentsSDK;

export default class SDK<WebhookTrigger = PublicWebHookTrigger> extends PaymentsSDK {
    public bankAccounts: BankAccounts;
    public cancels: Cancels;
    public captures: Captures;
    public charges: Charges;
    public checkoutInfo: CheckoutInfo;
    public ecInfo: ECInfo;
    public ecFormLinks: ECFormLinks;
    public ecForms: ECForms;
    public emails: Emails;
    public exchangeRates: ExchangeRates;
    public ledgers: Ledgers;
    public merchants: Merchants;
    public platforms: Platforms;
    public refunds: Refunds;
    public stores: Stores;
    public subscriptions: Subscriptions;
    public transactionTokens: TransactionTokens;
    public transfers: Transfers;
    public verification: Verification;
    public webHooks: WebHooks<WebhookTrigger>;

    constructor(options?: RestAPIOptions) {
        super(options);

        this.bankAccounts = new BankAccounts(this.api);
        this.cancels = new Cancels(this.api);
        this.captures = new Captures(this.api);
        this.charges = new Charges(this.api);
        this.checkoutInfo = new CheckoutInfo(this.api);
        this.ecInfo = new ECInfo(this.api);
        this.ecFormLinks = new ECFormLinks(this.api);
        this.ecForms = new ECForms(this.api);
        this.emails = new Emails(this.api);
        this.exchangeRates = new ExchangeRates(this.api);
        this.ledgers = new Ledgers(this.api);
        this.merchants = new Merchants(this.api);
        this.platforms = new Platforms(this.api);
        this.refunds = new Refunds(this.api);
        this.stores = new Stores(this.api);
        this.subscriptions = new Subscriptions(this.api);
        this.transactionTokens = new TransactionTokens(this.api);
        this.transfers = new Transfers(this.api);
        this.verification = new Verification(this.api);
        this.webHooks = new WebHooks(this.api);
    }
}
