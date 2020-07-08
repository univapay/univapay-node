/**
 *  @module SDK
 */

import { RestAPIOptions } from "./api/RestAPI";
// Resources
import { BankAccounts } from "./resources/BankAccounts";
import { Cancels } from "./resources/Cancels";
import { Captures } from "./resources/Captures";
import { Charges } from "./resources/Charges";
import { CheckoutInfo } from "./resources/CheckoutInfo";
import { ExchangeRates } from "./resources/ExchangeRates";
import { Ledgers } from "./resources/Ledgers";
import { Merchants } from "./resources/Merchants";
import { Platforms } from "./resources/Platforms";
import { Refunds } from "./resources/Refunds";
import { Stores } from "./resources/Stores";
import { Subscriptions } from "./resources/Subscriptions";
import { TransactionTokens } from "./resources/TransactionTokens";
import { Transfers } from "./resources/Transfers";
import { Verification } from "./resources/Verification";
import { WebHooks } from "./resources/WebHooks";
import { PaymentsSDK } from "./sdk/PaymentsSDK";

export default class SDK extends PaymentsSDK {
    public bankAccounts: BankAccounts;
    public cancels: Cancels;
    public captures: Captures;
    public charges: Charges;
    public checkoutInfo: CheckoutInfo;
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
    public webHooks: WebHooks;

    constructor(options?: RestAPIOptions) {
        super(options);

        this.bankAccounts = new BankAccounts(this.api);
        this.cancels = new Cancels(this.api);
        this.captures = new Captures(this.api);
        this.charges = new Charges(this.api);
        this.checkoutInfo = new CheckoutInfo(this.api);
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
