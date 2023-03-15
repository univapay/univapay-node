/**
 *  @module SDK
 */

import {
    BankAccounts,
    Cancels,
    Captures,
    Charges,
    CheckoutInfo,
    ECFormLinks,
    ECForms,
    ECInfo,
    Emails,
    ExchangeRates,
    Ledgers,
    Merchants,
    Platforms,
    Products,
    Refunds,
    Stores,
    Subscriptions,
    TransactionTokens,
    Transfers,
    Verification,
    WebHooks,
    WebHookTrigger as PublicWebHookTrigger,
} from "./resources/index.js";
import { LinksProducts } from "./resources/LinksProducts.js";
import PaymentsSDK from "./sdk/index.js";

export * from "./api/index.js";
export * from "./common/index.js";
export * from "./errors/index.js";
export * from "./resources/index.js";
export * from "./utils/index.js";
export const BaseSDK = PaymentsSDK;

export default class SDK<WebhookTrigger = PublicWebHookTrigger> extends PaymentsSDK {
    public bankAccounts: BankAccounts = new BankAccounts(this.api);
    public cancels: Cancels = new Cancels(this.api);
    public captures: Captures = new Captures(this.api);
    public charges: Charges = new Charges(this.api);
    public checkoutInfo: CheckoutInfo = new CheckoutInfo(this.api);
    public ecInfo: ECInfo = new ECInfo(this.api);
    public ecFormLinks: ECFormLinks = new ECFormLinks(this.api);
    public ecForms: ECForms = new ECForms(this.api);
    public ecLinksProducts: LinksProducts = new LinksProducts(this.api);
    public emails: Emails = new Emails(this.api);
    public exchangeRates: ExchangeRates = new ExchangeRates(this.api);
    public ledgers: Ledgers = new Ledgers(this.api);
    public merchants: Merchants = new Merchants(this.api);
    public platforms: Platforms = new Platforms(this.api);
    public products: Products = new Products(this.api);
    public refunds: Refunds = new Refunds(this.api);
    public stores: Stores = new Stores(this.api);
    public subscriptions: Subscriptions = new Subscriptions(this.api);
    public transactionTokens: TransactionTokens = new TransactionTokens(this.api);
    public transfers: Transfers = new Transfers(this.api);
    public verification: Verification = new Verification(this.api);
    public webHooks: WebHooks<WebhookTrigger> = new WebHooks(this.api);
}
