/**
 *  @module SDK
 */
import * as tslib_1 from "tslib";
import { PaymentsSDK } from './sdk/PaymentsSDK';
// Resources
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
var SDK = /** @class */ (function (_super) {
    tslib_1.__extends(SDK, _super);
    function SDK(options) {
        var _this = _super.call(this, options) || this;
        _this.bankAccounts = new BankAccounts(_this.api);
        _this.cancels = new Cancels(_this.api);
        _this.captures = new Captures(_this.api);
        _this.charges = new Charges(_this.api);
        _this.checkoutInfo = new CheckoutInfo(_this.api);
        _this.exchangeRates = new ExchangeRates(_this.api);
        _this.ledgers = new Ledgers(_this.api);
        _this.merchants = new Merchants(_this.api);
        _this.platforms = new Platforms(_this.api);
        _this.refunds = new Refunds(_this.api);
        _this.stores = new Stores(_this.api);
        _this.subscriptions = new Subscriptions(_this.api);
        _this.transactionTokens = new TransactionTokens(_this.api);
        _this.transfers = new Transfers(_this.api);
        _this.verification = new Verification(_this.api);
        _this.webHooks = new WebHooks(_this.api);
        return _this;
    }
    return SDK;
}(PaymentsSDK));
export default SDK;
//# sourceMappingURL=index.js.map