/**
 *  @internal
 *  @module Enums
 */

export enum CardBrand {
    VISA = "visa",
    MASTERCARD = "mastercard",
    MAESTRO = "maestro",
    AMEX = "american_express",
    DINERS = "diners_club",
    DISCOVER = "discover",
    JCB = "jcb",
    UNIONPAY = "unionpay",
    UNKNOWN = "unknown",
}

export enum CardType {
    CREDIT = "credit",
    DEBIT = "debit",
    CHARGECARD = "charge_card",
    UNKNOWN = "unknown",
}

export enum CardSubBrand {
    NONE = "none",
    VISA_ELECTRON = "visa_electron",
    DANKORT = "dankort",
    DINERS_CLUB_CARTE_BLANCHE = "diners_club_carte_blanche",
    DINERS_CLUB_INTERNATIONAL = "diners_club_international",
    DINERS_CLUB_US_CANADA = "diners_club_us_canada",
}

export enum CardCategory {
    CLASSIC = "classic",
    CORPORATE = "corporate",
    PREPAID = "prepaid",
}

export enum ProcessingMode {
    TEST = "test",
    LIVE = "live",
    LIVE_TEST = "live_test",
}

export enum QRBrand {
    ALIPAY = "alipay",
    ALIPAY_CHINA = "alipay_china",
    ALIPAY_HK = "alipay_hk",
    ALIPAY_SINGAPORE = "alipay_singapore",
    BARTONG = "bartong",
    DANA = "dana",
    DASH = "dash",
    D_BARAI = "d_barai",
    EZLINK = "ezlink",
    GCASH = "gcash",
    GLOBAL_PAY = "global_pay",
    JKOPAY = "jkopay",
    KAKAOPAY = "kakaopay",
    LINE_PAY = "line_pay",
    // LIIV = 'liiv',
    MERPAY = "merpay",
    ORIGAMI = "origami",
    PAY_PAY = "pay_pay",
    QQ = "qq",
    RAKUTEN_PAY = "rakuten_pay",
    TOUCH_N_GO = "tng",
    TRUEMONEY = "truemoney",
    WE_CHAT = "we_chat",
}

export enum QRGateway {
    ALIPAY = "alipay",
    ALIPAY_CONNECT = "alipay_connect",
    ALIPAY_MERCHANT_QR = "alipay_merchant_qr",
    BARTONG = "bartong",
    D_BARAI = "d_barai",
    JKOPAY = "jkopay",
    LINE_PAY = "line_pay",
    MERPAY = "merpay",
    QQ = "qq",
    ORIGAMI = "origami",
    PAY_PAY = "pay_pay",
    RAKUTEN_PAY = "rakuten_pay",
    VIA = "via",
    WE_CHAT = "we_chat",
}

export enum OnlineGateway {
    ALIPAY_ONLINE = "alipay_online",
    PAY_PAY_ONLINE = "pay_pay_online",
}
