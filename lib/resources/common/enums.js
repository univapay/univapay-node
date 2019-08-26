"use strict";
/**
 *  @internal
 *  @module Enums
 */
Object.defineProperty(exports, "__esModule", { value: true });
var CardBrand;
(function (CardBrand) {
    CardBrand["VISA"] = "visa";
    CardBrand["MASTERCARD"] = "mastercard";
    CardBrand["MAESTRO"] = "maestro";
    CardBrand["AMEX"] = "american_express";
    CardBrand["DINERS"] = "diners_club";
    CardBrand["DISCOVER"] = "discover";
    CardBrand["JCB"] = "jcb";
    CardBrand["UNIONPAY"] = "unionpay";
    CardBrand["UNKNOWN"] = "unknown";
})(CardBrand = exports.CardBrand || (exports.CardBrand = {}));
var CardType;
(function (CardType) {
    CardType["CREDIT"] = "credit";
    CardType["DEBIT"] = "debit";
    CardType["CHARGECARD"] = "charge_card";
    CardType["UNKNOWN"] = "unknown";
})(CardType = exports.CardType || (exports.CardType = {}));
var CardSubBrand;
(function (CardSubBrand) {
    CardSubBrand["NONE"] = "none";
    CardSubBrand["VISA_ELECTRON"] = "visa_electron";
    CardSubBrand["DANKORT"] = "dankort";
    CardSubBrand["DINERS_CLUB_CARTE_BLANCHE"] = "diners_club_carte_blanche";
    CardSubBrand["DINERS_CLUB_INTERNATIONAL"] = "diners_club_international";
    CardSubBrand["DINERS_CLUB_US_CANADA"] = "diners_club_us_canada";
})(CardSubBrand = exports.CardSubBrand || (exports.CardSubBrand = {}));
var CardCategory;
(function (CardCategory) {
    CardCategory["CLASSIC"] = "classic";
    CardCategory["CORPORATE"] = "corporate";
    CardCategory["PREPAID"] = "prepaid";
})(CardCategory = exports.CardCategory || (exports.CardCategory = {}));
var ProcessingMode;
(function (ProcessingMode) {
    ProcessingMode["TEST"] = "test";
    ProcessingMode["LIVE"] = "live";
    ProcessingMode["LIVE_TEST"] = "live_test";
})(ProcessingMode = exports.ProcessingMode || (exports.ProcessingMode = {}));
//# sourceMappingURL=enums.js.map