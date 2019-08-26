"use strict";
/**
 *  @module SDK
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PaymentsSDK_1 = require("./sdk/PaymentsSDK");
// Resources
var BankAccounts_1 = require("./resources/BankAccounts");
var Charges_1 = require("./resources/Charges");
var CheckoutInfo_1 = require("./resources/CheckoutInfo");
var Merchants_1 = require("./resources/Merchants");
var Ledgers_1 = require("./resources/Ledgers");
var Refunds_1 = require("./resources/Refunds");
var Captures_1 = require("./resources/Captures");
var Stores_1 = require("./resources/Stores");
var Subscriptions_1 = require("./resources/Subscriptions");
var TransactionTokens_1 = require("./resources/TransactionTokens");
var Transfers_1 = require("./resources/Transfers");
var Verification_1 = require("./resources/Verification");
var WebHooks_1 = require("./resources/WebHooks");
var Platforms_1 = require("./resources/Platforms");
var Cancels_1 = require("./resources/Cancels");
var ExchangeRates_1 = require("./resources/ExchangeRates");
var SDK = /** @class */ (function (_super) {
    tslib_1.__extends(SDK, _super);
    function SDK(options) {
        var _this = _super.call(this, options) || this;
        _this.bankAccounts = new BankAccounts_1.BankAccounts(_this.api);
        _this.cancels = new Cancels_1.Cancels(_this.api);
        _this.captures = new Captures_1.Captures(_this.api);
        _this.charges = new Charges_1.Charges(_this.api);
        _this.checkoutInfo = new CheckoutInfo_1.CheckoutInfo(_this.api);
        _this.exchangeRates = new ExchangeRates_1.ExchangeRates(_this.api);
        _this.ledgers = new Ledgers_1.Ledgers(_this.api);
        _this.merchants = new Merchants_1.Merchants(_this.api);
        _this.platforms = new Platforms_1.Platforms(_this.api);
        _this.refunds = new Refunds_1.Refunds(_this.api);
        _this.stores = new Stores_1.Stores(_this.api);
        _this.subscriptions = new Subscriptions_1.Subscriptions(_this.api);
        _this.transactionTokens = new TransactionTokens_1.TransactionTokens(_this.api);
        _this.transfers = new Transfers_1.Transfers(_this.api);
        _this.verification = new Verification_1.Verification(_this.api);
        _this.webHooks = new WebHooks_1.WebHooks(_this.api);
        return _this;
    }
    return SDK;
}(PaymentsSDK_1.PaymentsSDK));
exports.default = SDK;
//# sourceMappingURL=index.js.map