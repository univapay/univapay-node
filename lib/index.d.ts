/**
 *  @module SDK
 */
import { RestAPIOptions } from './api/RestAPI';
import { PaymentsSDK } from './sdk/PaymentsSDK';
import { BankAccounts } from './resources/BankAccounts';
import { Charges } from './resources/Charges';
import { CheckoutInfo } from './resources/CheckoutInfo';
import { Merchants } from './resources/Merchants';
import { Ledgers } from './resources/Ledgers';
import { Refunds } from './resources/Refunds';
import { Captures } from './resources/Captures';
import { Stores } from './resources/Stores';
import { Subscriptions } from './resources/Subscriptions';
import { TransactionTokens } from './resources/TransactionTokens';
import { Transfers } from './resources/Transfers';
import { Verification } from './resources/Verification';
import { WebHooks } from './resources/WebHooks';
import { Platforms } from './resources/Platforms';
import { Cancels } from './resources/Cancels';
import { ExchangeRates } from './resources/ExchangeRates';
export default class SDK extends PaymentsSDK {
    bankAccounts: BankAccounts;
    cancels: Cancels;
    captures: Captures;
    charges: Charges;
    checkoutInfo: CheckoutInfo;
    exchangeRates: ExchangeRates;
    ledgers: Ledgers;
    merchants: Merchants;
    platforms: Platforms;
    refunds: Refunds;
    stores: Stores;
    subscriptions: Subscriptions;
    transactionTokens: TransactionTokens;
    transfers: Transfers;
    verification: Verification;
    webHooks: WebHooks;
    constructor(options?: RestAPIOptions);
}
