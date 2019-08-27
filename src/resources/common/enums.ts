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
