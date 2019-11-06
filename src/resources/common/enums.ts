/**
 *  @internal
 *  @module Enums
 */

export enum CardBrand {
    VISA = 'visa',
    MASTERCARD = 'mastercard',
    MAESTRO = 'maestro',
    AMEX = 'american_express',
    DINERS = 'diners_club',
    DISCOVER = 'discover',
    JCB = 'jcb',
    UNIONPAY = 'unionpay',
    UNKNOWN = 'unknown',
}

export enum CardType {
    CREDIT = 'credit',
    DEBIT = 'debit',
    CHARGECARD = 'charge_card',
    UNKNOWN = 'unknown',
}

export enum CardSubBrand {
    NONE = 'none',
    VISA_ELECTRON = 'visa_electron',
    DANKORT = 'dankort',
    DINERS_CLUB_CARTE_BLANCHE = 'diners_club_carte_blanche',
    DINERS_CLUB_INTERNATIONAL = 'diners_club_international',
    DINERS_CLUB_US_CANADA = 'diners_club_us_canada',
}

export enum CardCategory {
    CLASSIC = 'classic',
    CORPORATE = 'corporate',
    PREPAID = 'prepaid',
}

export enum ProcessingMode {
    TEST = 'test',
    LIVE = 'live',
    LIVE_TEST = 'live_test',
}

export enum QRBrand {
    ALIPAY = 'alipay',
    ALIPAY_CHINA = 'alipay_china',
    ALIPAY_HK = 'alipay_hk',
    ALIPAY_SINGAPORE = 'alipay_singapore',
    DASH = 'dash',
    D_BARAI = 'd_barai',
    GLOBAL_PAY = 'global_pay',
    KAKAOPAY = 'kakaopay',
    ORIGAMI = 'origami',
    PAY_PAY = 'pay_pay',
    QQ = 'qq',
    RAKUTEN_PAY = 'rakuten_pay',
    WE_CHAT = 'we_chat',
}

export enum QRGateway {
    ALIPAY = 'alipay',
    ALIPAY_CONNECT = 'alipay_connect',
    BARTONG = 'bartong',
    D_BARAI = 'd_barai',
    QQ = 'qq',
    ORIGAMI = 'origami',
    PAY_PAY = 'pay_pay',
    RAKUTEN_PAY = 'rakuten_pay',
    VIA = 'via',
    WE_CHAT = 'we_chat',
}
