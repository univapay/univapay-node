/**
 *  @module Errors
 */

export enum RequestErrorCode {
    RequestError = "REQUEST_ERROR",
}

export enum ResponseErrorCode {
    /* generic */
    BadRequest = "BAD_REQUEST",
    Forbidden = "FORBIDDEN",
    NotFound = "NOT_FOUND",
    NotAllowed = "NOT_ALLOWED",
    Conflicted = "CONFLICTED",
    TooManyRequests = "TOO_MANY_REQUESTS",
    InternalServerError = "INTERNAL_SERVER_ERROR",
    ServiceUnavailable = "SERVICE_UNAVAILABLE",
    NotAuthorized = "NOT_AUTHORIZED",

    /* global */
    UnknownError = "UNKNOWN_ERROR",
    Timeout = "TIMEOUT",
    DBError = "DB_ERROR",
    InvalidRequest = "INVALID_REQUEST",
    UnableToGetIdempotentResult = "UNABLE_TO_GET_IDEMPOTENT_REQUEST",
    ServiceUnavailableTryAgain = "SERVICE_UNAVAILABLE_TRY_AGAIN",

    /* auth */
    InvalidDomain = "INVALID_DOMAIN",
    InvalidCredentials = "INVALID_CREDENTIALS",
    AuthHeaderMissing = "AUTH_HEADER_MISSING",
    InvalidPermissions = "INVALID_PERMISSIONS",
    ImproperAuth = "IMPROPER_AUTH",
    CouldNotRefreshAuth = "COULD_NOT_REFRESH_AUTH",
    UserBanned = "USER_BANNED",
    InvalidLoginToken = "INVALID_LOGIN_TOKEN",
    InvalidAppToken = "INVALID_APP_TOKEN",
    ExpiredLoginToken = "EXPIRED_LOGIN_TOKEN",
    OutdatedAppToken = "OUTDATED_APP_TOKEN",
    ChargeTooQuick = "CHARGE_TOO_QUICK",

    /* file upload */
    FileUploadError = "FILE_UPLOAD_ERROR",
    FileMaxSizeExceeded = "FILE_MAX_SIE_EXCEEDED",
    FileInvalidType = "FILE_INVALID_TYPE",
    FileNotFound = "FILE_NOT_FOUND",

    /* crud actions */
    TokenGenerationException = "TOKEN_GENERATION_EXCEPTION",
    TokenForWrongStore = "TOKEN_FOR_WRONG_STORE",
    NonSubscriptionPayment = "NON_SUBSCRIPTION_PAYMENT",
    BankAccountExists = "BANK_ACCOUNT_EXISTS",
    EmailExists = "EMAIL_EXISTS",
    StoreExists = "STORE_EXISTS",
    GatewayCredentialsExists = "GATEWAY_CREDENTIALS_EXISTS",
    WebhookURLExists = "WEBHOOK_URL_EXISTS",
    NonUniqueRuleForMerchant = "NON_UNIQUE_RULE_FOR_MERCHANT",
    NonUniqueRuleSetForMerchant = "NON_UNIQUE_RULE_SET_FOR_MERCHANT",
    NonUniqueRule = "NON_UNIQUE_RULE",
    RulePriorityMustBePositive = "RULE_PRIORITY_MUST_BE_POSITIVE",
    NonExistingRule = "NON_EXISTING_RULE",
    MustContainUniqueElementsOnly = "MUST_CONTAIN_UNIQUE_ELEMENTS_ONLY",
    GroupExists = "GROUP_EXISTS",
    PrimaryBankAccountNotFound = "PRIMARY_BANK_ACCOUNT_NOT_FOUND",
    MustHaveAPrimaryBankAccount = "MUST_HAVE_A_PRIMARY_BANK_ACCOUNT",
    VerificationDataExists = "VERIFICATION_DATA_EXISTS",
    TemplateExists = "TEMPLATE_EXISTS",
    StratusCredentialsExists = "STRATUS_CREDENTIALS_EXISTS",
    StratusRuleStillInUse = "STRATUS_RULE_STILL_IN_USE",
    ResourceLimitReached = "RESOURCE_LIMIT_REACHED",
    OnlyOnePaidyCredentialsAllowed = "ONLY_ONE_PAIDY_CREDENTIALS_ALLOWED",

    /* payments and charges */
    InvalidTokenType = "INVALID_TOKEN_TYPE",
    InvalidToken = "INVALID_TOKEN",
    InvalidCard = "INVALID_CARD",
    ForbiddenIP = "FORBIDDEN_IP",
    InvalidUserData = "INVALID_USER_DATA",
    NonUniqueActiveToken = "NON_UNIQUE_ACTIVE_TOKEN",
    TransactionAlreadyProcessed = "TRANSACTION_ALREADY_PROCESSED",
    TransactionTokenExpired = "TRANSACTION_TOKEN_EXPIRED",
    NoTestCardInLiveMode = "NO_TEST_CARD_IN_LIVE_MODE",
    RecurringTokenNotAllowed = "RECURRING_TOKEN_NOT_ALLOWED",
    RecurringTokenDisabled = "RECURRING_TOKEN_DISABLED",
    RecurringUsageLimitRequired = "RECURRING_USAGE_LIMIT_REQUIRED",
    RecurringUsageRequiresCVV = "RECURRING_USAGE_REQUIRES_CVV",
    UsageLimitNotApplicable = "USAGE_LIMIT_NOT_APPLICABLE",
    CardProcessingDisabled = "CARD_PROCESSING_DISABLED",
    QRProcessingDisabled = "QR_PROCESSING_DISABLED",
    ConvenienceProcessingDisabled = "CONVENIENCE_PROCESSING_DISABLED",
    NotOneTimeToken = "NOT_ONE_TIME_TOKEN",
    NotSubscriptionToken = "NOT_SUBSCRIPTION_TOKEN",
    NotRecurringToken = "NOT_RECURRING_TOKEN",
    CurrencyMustMatchCharge = "CURRENCY_MUST_MATCH_CHARGE",
    RefundNotWithinBounds = "REFUND_NOT_WITHIN_BOUNDS",
    InvalidTransfer = "INVALID_TRANSFER",
    TransferAlreadyExists = "TRANSFER_ALREADY_EXISTS",
    NoLedgers = "NO_LEDGERS",
    FailedToAssociateLedgers = "FAILED_TO_ASSOCIATE_LEDGERS",
    LiveModeNotEnabledWhenUnverified = "LIVE_MODE_NOT_ENABLED_WHEN_UNVERIFIED",
    SelfTransferNotPermitted = "SELF_TRANSFER_NOT_PERMITTED",
    CardLocked = "CARD_LOCKED",
    SubscriptionProcessing = "SUBSCRIPTION_PROCESSING",
    CannotUpdateTransactionToken = "CANNOT_UPDATE_TRANSACTION_TOKEN",
    AlreadyCaptured = "ALREADY_CAPTURED",
    CaptureAmountTooLarge = "CAPTURE_AMOUNT_TOO_LARGE",
    PartialCaptureNotSupported = "PARTIAL_CAPTURE_NOT_SUPPORTED",
    DebitAuthorizationDisabled = "DEBIT_AUTHORIZATION_DISABLED",
    PrePaidAuthorizationDisabled = "PREPAID_AUTHORIZATION_DISABLED",

    NoGatewaysAvailable = "NO_GATEWAY_AVAILABLE",
    CardBrandNotSupported = "CARD_BRAND_NOT_SUPPORTED",
    CardCountryNotSupported = "CARD_COUNTRY_NOT_SUPPORTED",
    CVVRequired = "CVV_REQUIRED",
    LastNameRequired = "LAST_NAME_REQUIRED",
    AuthNotSupported = "AUTH_NOT_SUPPORTED",

    InvalidBinRange = "INVALID_BIN_RANGE",
    VerificationRequired = "VERIFICATION_REQUIRED",

    /* validation responses */
    ChangeProhibited = "CHARGE_PROHIBITED",
    ForbiddenParameter = "FORBIDDEN_PARAMETER",
    ValidationError = "VALIDATION_ERROR",
    RequiredValue = "REQUIRED_VALUE",
    MustBeFutureTime = "MUST_BE_FUTURE_TIME",
    InvalidFormat = "INVALID_FORMAT",
    InvalidPercentFee = "INVALID_PERCENT_FEE",
    InvalidCardNumber = "INVALID_CARD_NUMBER",
    InvalidCardExpiration = "INVALID_CARD_EXPIRATION",
    InvalidCVV = "INVALID_CVV",
    InvalidFormatLength = "INVALID_FORMAT_LENGTH",
    InvalidFormatUUID = "INVALID_UUID",
    InvalidFormatBase64 = "INVALID_FORMAT_BASE64",
    InvalidFormatEmail = "INVALID_FORMAT_EMAIL",
    InvalidFormatCurrency = "INVALID_FORMAT_CURRENCY",
    InvalidCurrency = "INVALID_CURRENCY",
    InvalidAmount = "INVALID_AMOUNT",
    InvalidEventForStore = "INVALID_EVENT_FOR_STORE",
    InvalidEventForPlatform = "INVALID_EVENT_FOR_PLATFORM",
    InvalidEventForMerchant = "INVALID_EVENT_FOR_MERCHANT",
    InvalidFormatDomain = "INVALID_FORMAT_DOMAIN",
    InvalidFormatUrl = "INVALID_FORMAT_URL",
    InvalidFormatObject = "INVALID_FORMAT_OBJECT",
    InvalidFormatCountry = "INVALID_FORMAT_COUNTRY",
    InvalidPhoneNumber = "INVALID_PHONE_NUMBER",
    InvalidFormatSwiftCode = "INVALID_FORMAT_SWIFT_CODE",
    InvalidFormatRoutingNumber = "INVALID_FORMAT_ROUTING_NUMBER",
    InvalidFormatRoutingCode = "INVALID_FORMAT_ROUTING_CODE",
    InvalidFormatIfcsCode = "INVALID_FORMAT_IFCS_CODE",
    InvalidFormatBankAccountNumber = "INVALID_FORMAT_BANK_ACCOUNT_NUMBER",
    InvalidPasswords = "INVALID_PASSWORDS",
    InvalidTimePeriod = "INVALID_TIME_PERIOD",
    InvalidDayOfWeek = "INVALID_DAY_OF_WEEK",
    InvalidWeekOfMonth = "INVALID_WEEK_OF_MONTH",
    InvalidDayOfMonth = "INVALID_DAY_OF_MONTH",
    InvalidColorsSize = "INVALID_COLOR_SIZE",
    NestedJsonNotAllowed = "NESTED_JSON_NOT_ALLOWED",
    InvalidFormatDate = "INVALID_FORMAT_DATE",
    InvalidChargeStatus = "INVALID_CHARGE_STATUS",
    InvalidQRScanGateway = "INVALID_QR_SCAN_GATEWAY",
    CardLimitExceededForStore = "CARD_LIMIT_EXCEEDED_FOR_STORE",
    InvalidLanguage = "INVALID_LANGUAGE",
    SubscriptionNotAllowed = "SUBSCRIPTION_NOT_ALLOWED",
    OneTimeOnlyAllowed = "ONE_TIME_ONLY_ALLOWED",
    AuthExpired = "AUTH_EXPIRED",
    InvalidTemplateKey = "INVALID_TEMPLATE_KEY",
    NonPublicTemplate = "NON_PUBLIC_TEMPLATE",
    OnlyJapanesePhoneNumberAllowed = "ONLY_JAPANESE_PHONE_NUMBER_ALLOWED",
    ExpirationDateOutOfBounds = "EXPIRATION_DATE_OUT_OF_BOUNDS",
    UnsupportedLanguage = "UNSUPPORTED_LANGUAGE",
    DefaultLanguageNotSupported = "DEFAULT_LANGUAGE_NOT_SUPPORTED",
    CaptureOnlyForCardPayment = "CAPTURE_ONLY_FOR_CARD_PAYMENT",
    InvalidCardTypeForCapture = "INVALID_CARD_TYPE_FOR_CAPTURE",
    InvalidScheduledCaptureDate = "INVALID_SCHEDULED_CAPTURE_DATE",
    InvalidMerchantStatus = "INVALID_MERCHANT_STATUS",
    IncoherentDateRange = "INCOHERENT_DATE_RANGE",
    MustHaveOneElement = "MUST_HAVE_ONE_ELEMENT",
    ThresholdMustBeNull = "THRESHOLD_MUST_BE_NULL",
    IllegalNumberOfItems = "ILLEGAL_NUMBER_OF_ITEMS",
    UnableToReadCredentials = "UNABLE_TO_READ_CREDENTIALS",
    GatewayError = "GATEWAY_ERROR",
    GatewayNoLongerSupported = "GATEWAY_NO_LONGER_SUPPORTED",
    InvalidChargeAmountLimit = "INVALID_CHARGE_AMOUNT_LIMIT",
    PlatformCurrencyRequiredInCvvAmount = "PLATFORM_CURRENCY_REQUIRED_IN_CVV_AMOUNT",
    TransferScheduleWaitPeriodAndPeriodRequired = "TRANSFER_SCHEDULE_WAIT_PERIOD_AND_PERIOD_REQUIRED",
    ChargeAmountTooLow = "CHARGE_AMOUNT_TOO_LOW",
    ChargeAmountTooHigh = "CHARGE_AMOUNT_TOO_HIGH",
    MustHaveAtLeastOneElement = "MUST_HAVE_AT_LEAST_ONE_ELEMENT",
    MustContainPlatformCurrency = "MUST_CONTAIN_PLATFORM_CURRENCY",

    /** Used when creating a new Merchant */
    OnlyASCII = "ONLY_ASCII",
    UniqueCharacters = "UNIQUE_CHARACTERS",
    AtLeastOneDigit = "AT_LEAST_ONE_DIGIT",
    AtLeastOneLetter = "AT_LEAST_ONE_LETTER",
    EmptyRoles = "EMPTY_ROLES",
    EditOwnRolesNotAllowed = "EDIT_OWN_ROLES_NOT_ALLOWED",
    InvalidCardBrand = "INVALID_CARD_BRAND",
    UnsupportedCountry = "UNSUPPORTED_COUNTRY",
    UnsupportedCurrency = "UNSUPPORTED_CURRENCY",
    CannotBanSelf = "CANNOT_BAN_SELF",
    CannotSelfTerminate = "CANNOT_SELF_TERMINATE",
    NoDuplicateCurrencies = "NO_DUPLICATE_CURRENCIES",

    PlatformNotFound = "PLATFORM_NOT_FOUND",
    InvalidPlatform = "INVALID_PLATFORM",
    InvalidInvoiceFeeConfiguration = "INVALID_INVOICE_FEE_CONFIGURATION",
    InvalidPlatformRole = "INVALID_PLATFORM_ROLE",

    /* verification */
    DataNotSubmitted = "DATA_NOT_SUBMITTED",
    NoBankAccount = "NO_BANK_ACCOUNT",
    PercentFeeNotSubmitted = "PERCENT_FEE_NOT_SUBMITTED",
    InsufficientSystemManagerInfo = "INSUFFICIENT_SYSTEM_MANAGER_INFO",

    /* gateway credentials */
    CredentialsExist = "CREDENTIALS_EXISTS",
    GatewayConfigurationRequired = "GATEWAY_CONFIGURATION_REQUIRED",

    /* Gateway simulation */
    PlatformCredentialsDisabled = "PLATFORM_CREDENTIALS_DISABLED",
    ForbiddenGateway = "FORBIDDEN_GATEWAY",
    ForbiddenQrGateway = "FORBIDDEN_QR_GATEWAY",
    BlacklistedTagOnMerchant = "BLACKLISTED_TAG_ON_MERCHANT",
    BlacklistedTagOnStore = "BLACKLISTED_TAG_ON_STORE",
    NotOnWhitelist = "NOT_ON_WHITELIST",
    CannotShareMerchantCredentials = "CANNOT_SHARE_MERCHANT_CREDENTIALS",
    MissingGatewayConfiguration = "MISSING_GATEWAY_CONFIGURATION",
    GatewayConfigNotFound = "GATEWAY_CONFIG_NOT_FOUND",
    NotActive = "NOT_ACTIVE",
    ModeNotSupported = "MODE_NOT_SUPPORTED",

    /* Refund */
    RefundExceedsChargeAmount = "REFUND_EXCEEDS_CHARGE_AMOUNT",
    CannotRefundUnsuccessfulCharge = "CANNOT_REFUND_UNSUCCESSFUL_CHARGE",
    RefundNotAllowed = "REFUND_NOT_ALLOWED",
    CancelNotAllowed = "CANCEL_NOT_ALLOWED",

    /* apple pay */
    ApplePayNotEnabled = "APPLE_PAY_NOT_ENABLED",
    ApplePayAlreadyEnabled = "APPLE_PAY_ALREADY_ENABLED",
    ApplePayCertificateAlreadyUpdated = "APPLE_PAY_CERTIFICATE_ALREADY_UPDATED",
    ApplePayUnsupportedAlgorithm = "APPLE_PAY_UNSUPPORTED_ALGORITHM",
    ApplePayCertificateNotFound = "APPLE_PAY_CERTIFICATE_NOT_FOUND",
    ApplePayUnableToGenerateCertificateRequest = "APPLE_PAY_UNABLE_TO_GENERATE_CERTIFICATE_REQUEST",
    ApplePayInvalidConfiguration = "APPLE_PAY_INVALID_CONFIGURATION",
    ApplePayInvalidCertificate = "APPLE_PAY_INVALID_CERTIFICATE",
    ApplePayInvalidAlgorithm = "APPLE_PAY_INVALID_ALGORITHM",
    ApplePayInvalidCertificateFormat = "APPLE_PAY_INVALID_CERTIFICATE_FORMAT",
    ApplePayInvalidSignature = "APPLE_PAY_INVALID_SIGNATURE",
    ApplePayError = "APPLE_PAY_ERROR",

    UnableToGenerateCertificateRequest = "UNABLE_TO_GENERATE_CERTIFICATE_REQUEST",
    InvalidMerchantSettings = "INVALID_MERCHANT_SETTINGS",
    UnsupportedAlgorithm = "UNSUPPORTED_ALGORITHM",
    InvalidPaymentToken = "INVALID_PAYMENT_TOKEN",
    ExpiredPaymentToken = "EXPIRED_PAYMENT_TOKEN",
    InvalidCertificate = "INVALID_CERTIFICATE",
    InvalidLeafCertificate = "INVALID_LEAF_CERTIFICATE",
    InvalidIntermediateCertificate = "INVALID_INTERMEDIATE_CERTIFICATE",
    InvalidChainOfTrust = "INVALID_CHAIN_OF_TRUST",
    InvalidSignature = "INVALID_SIGNATURE",

    /** Platform */
    PlatformKeyExists = "PLATFORM_KEY_EXISTS",
    MerchantConsoleURIExists = "MERCHANT_CONSOLE_URI_EXISTS",

    /* idempotency */
    IdempotencyKeyConflict = "IDEMPOTENCY_KEY_CONFLICT",

    /* BannedCards */
    CardBanned = "CARD_BANNED",
    // CRUD
    CardAlreadyBanned = "CARD_ALREADY_BANNED",
    CardNotBanned = "CARD_NOT_BANNED",
    TestCardCannotBeBanned = "TEST_CARD_CANNOT_BE_BANNED",

    /* Stats */
    InvalidMetric = "INVALID_METRIC",
    InvalidResource = "INVALID_RESOURCE",

    /** Installments & Subscriptions */
    UseStartOn = "USE_START_ON",
    PaymentInTimePeriod = "PAYMENT_IN_TIME_PERIOD",
    SecondChargeAlreadyMade = "SECOND_CHARGE_ALREADY_MADE",
    NotSupportedByProcessor = "NOT_SUPPORTED_BY_PROCESSOR",
    SubscriptionAlreadyCanceled = "SUBSCRIPTION_ALREADY_CANCELED",
    SubscriptionNotFound = "SUBSCRIPTION_NOT_FOUND",
    MustBeLowerThanFullAmount = "MUST_BE_LOWER_THAN_FULL_AMOUNT",
    InstallmentPlanNotFound = "INSTALLMENT_PLAN_NOT_FOUND",
    InstallmentAlreadySet = "INSTALLMENT_ALREADY_SET",
    InstallmentInvalidPlan = "INSTALLMENT_INVALID_PLAN",
    InstallmentInvalidPlanType = "INSTALLMENT_INVALID_PLAN_TYPE",
    InstallmentPaymentTypeNotAllowedForPlan = "INSTALLMENT_PAYMENT_TYPE_NOT_ALLOWED_FOR_PLAN",
    InstallmentInvalidInitialAmount = "INSTALLMENT_INVALID_INITIAL_AMOUNT",
    InstallmentMaxPayoutPeriodExceeded = "INSTALLMENT_MAX_PAYOUT_PERIOD_EXCEEDED",
    InstallmentInsufficientAmountPerCharge = "INSTALLMENT_INSUFFICIENT_AMOUNT_PER_CHARGE",
    InstallmentRevolvingPlanCannotSetInitialAmount = "INSTALLMENT_REVOLVING_PLAN_CANNOT_SET_INITIAL_AMOUNT",
    InstallmentRevolvingPlanCannotSetSubsequentCyclesStart = "INSTALLMENT_REVOLVING_PLAN_CANNOT_SET_SUBSEQUENT_CYCLES_START",
    InstallmentProcessorInitialAmountsNotSupported = "INSTALLMENT_PROCESSOR_INITIAL_AMOUNTS_NOT_SUPPORTED",
    InstallmentProcessorPeriodNotSupported = "INSTALLMENT_PROCESSOR_PERIOD_NOT_SUPPORTED",
    CannotChangeToken = "CANNOT_CHANGE_TOKEN",
    InstallmentsNotEnabled = "INSTALLMENTS_NOT_ENABLED",
    CannotChangeInstallmentAmount = "CANNOT_CHANGE_INSTALLMENT_AMOUNT",
    CannotChangeToInstallment = "CANNOT_CHANGE_TO_INSTALLMENT",
    MustBeMonthBasedToSet = "MUST_BE_MONTH_BASED_TO_SET",
    MustBeWithinTwoCycles = "MUST_BE_WITHIN_TWO_CYCLES",
    Deprecated = "DEPRECATED",
    CannotBeZero = "CANNOT_BE_ZERO",
    NeedAtLeastTwoCycles = "NEED_AT_LEAST_TWO_CYCLES",
    InstallmentInvalidCyclesCount = "INSTALLMENT_INVALID_CYCLES_COUNT",

    CannotSetInitialAmountToZero = "CANNOT_SET_INITIAL_AMOUNT_TO_ZERO",
    CannotSetUntilSubscriptionStarted = "CANNOT_SET_UNTIL_SUBSCRIPTION_STARTED",
    CannotSetAfterSubscriptionStarted = "CANNOT_SET_AFTER_SUBSCRIPTION_STARTED",
    CannotChangeCanceledSubscription = "CANNOT_CHANGE_CANCELED_SUBSCRIPTION",

    /* Stratus merchant & store configuration */
    StratusMerchantAlreadyExists = "STRATUS_MERCHANT_ALREADY_EXISTS",
    StratusStoreAlreadyExists = "STRATUS_STORE_ALREADY_EXISTS",
    StratusStoreAllocationLimitReached = "STRATUS_STORE_ALLOCATION_LIMIT_REACHED",

    /* path bindables */
    InvalidElasticIndex = "INVALID_ELASTIC_INDEX",
    InvalidDateHistogramInterval = "INVALID_DATE_HISTORY_INTERVAL",
    InvalidSqsEndpointKey = "INVALID_SQS_ENDPOINT_KEY",

    /* invalid card errors */
    BinNotFound = "BIN_NOT_FOUND",
    LuhnCheckFailed = "LUHN_CHECK_FAILED",
    InvalidCardNumberLength = "INVALID_CARD_NUMBER_LENGTH",
    CardPaymentDisabled = "CARD_PAYMENT_DISABLED",
    DebitDisabled = "DEBIT_DISABLED",
    PrepaidDisabled = "PREPAID_DISABLED",
    CountryNotSupported = "COUNTRY_NOT_SUPPORTED",
    Unspecified = "UNSPECIFIED",

    /* gateway configuration errors */
    InvalidMerchantCategoryCode = "INVALID_MERCHANT_CATEGORY_CODE",

    InvalidJapanesePostalCode = "INVALID_JAPANESE_POSTAL_CODE",
}

export class APIError extends Error {
    status: number;
    response: Record<string, any>;

    constructor(status: number, response?: Record<string, any>) {
        super();
        this.status = status;
        this.response = Object.keys(response || {}).length !== 0 ? response : null;
        Object.setPrototypeOf(this, APIError.prototype);
    }
}
