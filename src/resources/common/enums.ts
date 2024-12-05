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
    PRIVATE_LABEL = "private_label",
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
    GOLD = "gold",
    TITANIUM = "titanium",
    PLATINUM = "platinum",
    ATM = "atm",
    ELECTRON = "electron",
    MAESTRO = "maestro",
    WORLD = "world",
    BUSINESS = "business",
    BLACK = "black",
    CENTURION = "centurion",
    CHARGE_CARD = "charge_card",
    CREDIT = "credit",
    DEBIT = "debit",
    PERSONAL = "personal",
    SIGNATURE = "signature",
    STANDARD = "standard",
}

export enum ProcessingMode {
    TEST = "test",
    LIVE = "live",
    LIVE_TEST = "live_test",
}

export enum QRBrand {
    ALIPAY = "alipay",
    ALIPAY_CHINA = "alipay_china",
    ALIPAY_CONNECT_MPM = "alipay_connect_mpm",
    ALIPAY_HK = "alipay_hk",
    ALIPAY_SINGAPORE = "alipay_singapore",
    AU_PAY = "au_pay",
    BARTONG = "bartong",
    COI_PAY_HIROSHIMA = "coi_pay_hiroshima",
    DANA = "dana",
    DASH = "dash",
    D_BARAI = "d_barai",
    EZLINK = "ezlink",
    GCASH = "gcash",
    GINKO_PAY = "ginko_pay",
    GLOBAL_PAY = "global_pay",
    HAMA_PAY = "hama_pay",
    HELLOMONEY = "hellomoney",
    HOKUHOKU_PAY_HOKKAIDO = "hokuhoku_pay_hokkaido",
    HOKUHOKU_PAY_HOKURIKU = "hokuhoku_pay_hokuriku",
    JKOPAY = "jkopay",
    KAKAOPAY = "kakaopay",
    LINE_PAY = "line_pay",
    // LIIV = 'liiv',
    MERPAY = "merpay",
    OKI_PAY = "oki_pay",
    ORIGAMI = "origami",
    PAY_PAY = "pay_pay",
    PAY_PAY_MERCHANT = "pay_pay_merchant",
    QQ = "qq",
    RAKUTEN_PAY = "rakuten_pay",
    RAKUTEN_PAY_MERCHANT = "rakuten_pay_merchant",
    SMBC = "smbc",
    TOUCH_N_GO = "tng",
    TRUEMONEY = "truemoney",
    YOKA_PAY_FUKUOKA = "yoka_pay_fukuoka",
    YOKA_PAY_KUMAMOTO = "yoka_pay_kumamoto",
    YOKA_PAY_SHINWA = "yoka_pay_shinwa",
    YUCHO_PAY = "yucho_pay",
    WE_CHAT = "we_chat",
    WE_CHAT_MPM = "we_chat_mpm",
}

export enum QRGateway {
    ALIPAY = "alipay",
    ALIPAY_CONNECT = "alipay_connect",
    ALIPAY_CONNECT_MPM = "alipay_connect_mpm",
    ALIPAY_MERCHANT_QR = "alipay_merchant_qr",
    ALIPAY_PLUS = "alipay_plus",
    AU_PAY = "au_pay",
    BARTONG = "bartong",
    BOOST = "boost",
    BPI = "bpi",
    D_BARAI = "d_barai",
    D_BARAI_MPM = "d_barai_mpm",
    GINKO_PAY = "ginko_pay",
    HELLOMONEY = "hellomoney",
    JKOPAY = "jkopay",
    LINE_PAY = "line_pay",
    MERPAY = "merpay",
    QQ = "qq",
    ORIGAMI = "origami",
    PAY_PAY = "pay_pay",
    PAY_PAY_MERCHANT = "pay_pay_merchant",
    RABBIT_LINE_PAY = "rabbit_line_pay",
    RAKUTEN_PAY = "rakuten_pay",
    RAKUTEN_PAY_MERCHANT = "rakuten_pay_merchant",
    VIA = "via",
    WE_CHAT = "we_chat",
    WE_CHAT_MPM = "we_chat_mpm",
}

export enum OnlineBrand {
    ALIPAY_ONLINE = "alipay_online",
    ALIPAY_PLUS_ONLINE = "alipay_plus_online",
    D_BARAI_ONLINE = "d_barai_online",
    PAY_PAY_ONLINE = "pay_pay_online",
    WE_CHAT_ONLINE = "we_chat_online",

    BPI = "bpi",
    BOOST = "boost",
    RABBIT_LINE_PAY = "rabbit_line_pay",

    // Alipay+ Online
    TINABA = "tinaba",
    NAVER_PAY = "naver_pay",
    TOSS_PAY = "toss_pay",
    PAYMAYA = "maya",
    GRAB_PAY = "grab_sg",
    KREDIVO = "kredivo_id",
    K_PLUS = "k_plus",
    BIG_PAY_MY = "big_pay_my",
    BIG_PAY_SG = "big_pay_sg",
    BIG_PAY_TH = "big_pay_th",
    KASPI_KZ = "kaspi_kz",

    /**
     * @deprecated Use `ALIPAY_PLUS_ONLINE` instead
     */
    ALIPAY_CONNECT_ONLINE = "alipay_connect_online",
}

export enum AlipayPlusOnlineBrand {
    TINABA = "tinaba",
    NAVER_PAY = "naver_pay",
    TOSS_PAY = "toss_pay",
    PAYMAYA = "maya",
    GRAB_PAY = "grab_sg",
    KREDIVO = "kredivo_id",
    K_PLUS = "k_plus",
    BIG_PAY_MY = "big_pay_my",
    BIG_PAY_SG = "big_pay_sg",
    BIG_PAY_TH = "big_pay_th",
    KASPI_KZ = "kaspi_kz",
}

// Alipay+ Offline
export enum RetailBrand {
    TINABA = "tinaba",
    NAVER_PAY = "naverpay",
    TOSS_PAY = "tosspay",
    OCBC_BANK = "ocbc",
    CHANGI_PAY = "changipay",
    HI_PAY = "hipay",
    PUBLIC_BANK = "pbengagemy",
    M_PAY = "mpay",
}

/**
 * @deprecated Use `brand` parameter and the `OnlineBrand` enum
 */
export enum OnlineGateway {
    ALIPAY_ONLINE = "alipay_online",
    D_BARAI_ONLINE = "d_barai_online",
    PAY_PAY_ONLINE = "pay_pay_online",
    WE_CHAT_ONLINE = "we_chat_online",
}

export enum BankTransferBrand {
    AOZORA_BANK = "aozora_bank",
    TEST = "bank_test_brand",
}
