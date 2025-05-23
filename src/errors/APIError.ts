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
    NoGatewayAvailableToProcessRequest = "NO_GATEWAY_AVAILABLE_TO_PROCESS_REQUEST",
    NotAuthorized = "NOT_AUTHORIZED",
    ProcessingError = "PROCESSING_ERROR",

    /* global */
    UnknownError = "UNKNOWN_ERROR",
    Timeout = "TIMEOUT",
    DBError = "DB_ERROR",
    InvalidRequest = "INVALID_REQUEST",
    UnableToGetIdempotentResult = "UNABLE_TO_GET_IDEMPOTENT_REQUEST",
    ServiceUnavailableTryAgain = "SERVICE_UNAVAILABLE_TRY_AGAIN",
    ServiceRestricted = "SERVICE_RESTRICTED", // too many charge failure on the IP
    RateLimitExceeded = "RATE_LIMIT_EXCEEDED",

    /* auth */
    InvalidIpAddress = "INVALID_IP_ADDRESS",
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
    RequiresValidMerchantGatewayConfig = "REQUIRES_VALID_MERCHANT_GATEWAY_CONFIG",
    MergedConfigurationNotFound = "MERGED_CONFIGURATION_NOT_FOUND",
    GatewayConfigurationExists = "GATEWAY_CONFIGURATION_EXISTS",
    OnlyOnePaidyCredentialsAllowed = "ONLY_ONE_PAIDY_CREDENTIALS_ALLOWED",
    OnlyOneDBaraiCredentialsAllowed = "ONLY_ONE_D_BARAI_CREDENTIALS_ALLOWED",
    OnlyMerchantOrStoreCredentialsAllowed = "ONLY_MERCHANT_OR_STORE_CREDENTIALS_ALLOWED",

    /* payments and charges */
    InvalidTokenType = "INVALID_TOKEN_TYPE",
    InvalidToken = "INVALID_TOKEN",
    InvalidCard = "INVALID_CARD",
    TransactionTokenIsNotRecurring = "TRANSACTION_TOKEN_IS_NOT_RECURRING",
    ForbiddenIP = "FORBIDDEN_IP",
    InvalidUserData = "INVALID_USER_DATA",
    NonUniqueActiveToken = "NON_UNIQUE_ACTIVE_TOKEN",
    TransactionAlreadyProcessed = "TRANSACTION_ALREADY_PROCESSED",
    TransactionTokenExpired = "TRANSACTION_TOKEN_EXPIRED",
    NoTestCardInLiveMode = "NO_TEST_CARD_IN_LIVE_MODE",
    ProcessingModeMismatch = "PROCESSING_MODE_MISMATCH",
    PaymentTypeNotAllowed = "PAYMENT_TYPE_NOT_ALLOWED",
    RecurringTokenNotAllowed = "RECURRING_TOKEN_NOT_ALLOWED",
    RecurringTokenDisabled = "RECURRING_TOKEN_DISABLED",
    RecurringUsageLimitRequired = "RECURRING_USAGE_LIMIT_REQUIRED",
    RecurringUsageRequiresCVV = "RECURRING_USAGE_REQUIRES_CVV",
    CvvAuthorizationNotCompleted = "CVV_AUTHORIZATION_NOT_COMPLETED",
    UsageLimitNotApplicable = "USAGE_LIMIT_NOT_APPLICABLE",
    CardProcessingDisabled = "CARD_PROCESSING_DISABLED",
    QRProcessingDisabled = "QR_PROCESSING_DISABLED",
    PaidyProcessingDisabled = "PAIDY_PROCESSING_DISABLED",
    MerchantQRProcessingDisabled = "MERCHANT_QR_PROCESSING_DISABLED",
    OnlineProcessingDisabled = "ONLINE_PROCESSING_DISABLED",
    ConvenienceProcessingDisabled = "CONVENIENCE_PROCESSING_DISABLED",
    NotOneTimeToken = "NOT_ONE_TIME_TOKEN",
    NotSubscriptionToken = "NOT_SUBSCRIPTION_TOKEN",
    NotRecurringToken = "NOT_RECURRING_TOKEN",
    CurrencyMustMatchCharge = "CURRENCY_MUST_MATCH_CHARGE",
    NoDirectCurrencyGateway = "NO_DIRECT_CURRENCY_GATEWAY",
    TokenMustBeConfirmed = "TOKEN_MUST_BE_CONFIRMED",
    ConfirmationRequiresEmail = "CONFIRMATION_REQUIRES_EMAIL",
    WrongConfirmationCode = "WRONG_CONFIRMATION_CODE",
    RefundNotWithinBounds = "REFUND_NOT_WITHIN_BOUNDS",
    RefundExceedsSales = "REFUND_EXCEEDS_SALES",
    InvalidTransfer = "INVALID_TRANSFER",
    TransferAlreadyExists = "TRANSFER_ALREADY_EXISTS",
    NoLedgers = "NO_LEDGERS",
    FailedToAssociateLedgers = "FAILED_TO_ASSOCIATE_LEDGERS",
    LiveModeNotEnabledWhenUnverified = "LIVE_MODE_NOT_ENABLED_WHEN_UNVERIFIED",
    SelfTransferNotPermitted = "SELF_TRANSFER_NOT_PERMITTED",
    CardLocked = "CARD_LOCKED",
    SubscriptionProcessing = "SUBSCRIPTION_PROCESSING",
    SubscriptionUnsupportedForInstallment = "SUBSCRIPTION_UNSUPPORTED_FOR_INSTALLMENT",
    CannotUpdateTransactionToken = "CANNOT_UPDATE_TRANSACTION_TOKEN",
    AlreadyCaptured = "ALREADY_CAPTURED",
    CaptureAmountTooLarge = "CAPTURE_AMOUNT_TOO_LARGE",
    PartialCaptureNotSupported = "PARTIAL_CAPTURE_NOT_SUPPORTED",
    DebitAuthorizationDisabled = "DEBIT_AUTHORIZATION_DISABLED",
    PrePaidAuthorizationDisabled = "PREPAID_AUTHORIZATION_DISABLED",
    EmailExistsForCard = "EMAIL_EXISTS_FOR_CARD",

    NoGatewaysAvailable = "NO_GATEWAY_AVAILABLE",
    NoGatewayCredentialsAvailable = "NO_GATEWAY_CREDENTIALS_AVAILABLE",
    NoGatewayTransactionIdAvailable = "NO_GATEWAY_TRANSACTION_ID_AVAILABLE",
    PaymentTypeNotSupportedForCheck = "PAYMENT_TYPE_NOT_SUPPORTED_FOR_CHECK",
    NoGatewayCredentialsForSelectedPaymentType = "NO_GATEWAY_CREDENTIALS_FOR_SELECTED_PAYMENT_TYPE",
    DisabledPaymentType = "DISABLED_PAYMENT_TYPE",
    CardBrandNotSupported = "CARD_BRAND_NOT_SUPPORTED",
    CardCountryNotSupported = "CARD_COUNTRY_NOT_SUPPORTED",
    CurrencyNotSupported = "CURRENCY_NOT_SUPPORTED",
    CVVRequired = "CVV_REQUIRED",
    LastNameRequired = "LAST_NAME_REQUIRED",
    AuthNotSupported = "AUTH_NOT_SUPPORTED",

    InvalidBinRange = "INVALID_BIN_RANGE",
    OverlappingStratusTerminalIdRange = "OVERLAPPING_STRATUS_TERMINAL_ID_RANGE",
    InvalidStratusTerminalIdRange = "INVALID_STRATUS_TERMINAL_ID_RANGE",
    InvalidCardCompany = "INVALID_CARD_COMPANY",
    VerificationRequired = "VERIFICATION_REQUIRED",

    // Charge errors
    CardNumberNotValid = "CARD_NUMBER_NOT_VALID",
    CardExpirationMonthInvalid = "CARD_EXPIRATION_MONTH_INVALID",
    CardExpirationYearInvalid = "CARD_EXPIRATION_YEAR_INVALID",
    CardExpired = "CARD_EXPIRED",
    CardCVVInvalid = "CARD_CVV_INVALID",
    CardRejected = "CARD_REJECTED",
    CardInvalid = "CARD_INVALID",
    ChargeInvalidData = "CHARGE_INVALID_DATA",
    ExpirationDateError = "EXPIRATION_DATE_ERROR",
    TooManyChargeRequests = "TOO_MANY_CHARGE_REQUESTS",
    CancelUnavailable = "CANCEL_UNAVAILABLE",
    ChargeExpired = "CHARGE_EXPIRED",
    SeizeCard = "SEIZE_CARD",
    ContactBank = "CONTACT_BANK",
    FraudSuspected = "FRAUD_SUSPECTED",
    BankSystemFailure = "BANK_SYSTEM_FAILURE",
    DynamicDescriptorNotSupported = "DYNAMIC_DESCRIPTOR_NOT_SUPPORTED",
    PaymentCodeInvalid = "PAYMENT_CODE_INVALID",
    PaymentCodeExpired = "PAYMENT_CODE_EXPIRED",
    PaymentCodeAlreadyUsed = "PAYMENT_CODE_ALREADY_USED",
    PaymentCodeStillInUse = "PAYMENT_CODE_STILL_IN_USE",
    RejectedHighRisk = "REJECTED_HIGH_RISK",
    ConfirmationPeriodExpired = "CONFIRMATION_PERIOD_EXPIRED",
    RevertFailed = "REVERT_FAILED",
    RefundFailed = "REFUND_FAILED",
    PaymentWalletInsufficientFunds = "PAYMENT_WALLET_INSUFFICIENT_FUNDS",
    InvalidMetadataFieldValue = "INVALID_METADATA_FIELD_VALUE",
    CrossBorderNotAcceptedMissingId = "CROSS_BORDER_NOT_ACCEPTED_MISSING_ID",
    CrossBorderNotAcceptedMissingPhoneNumber = "CROSS_BORDER_NOT_ACCEPTED_MISSING_PHONE_NUMBER",
    CrossBorderNotAcceptedUnacceptedPaymentMethod = "CROSS_BORDER_NOT_ACCEPTED_UNACCEPTED_PAYMENT_METHOD",
    CrossBorderNotAcceptedMissingName = "CROSS_BORDER_NOT_ACCEPTED_MISSING_NAME",
    LimitExceededForPaymentType = "LIMIT_EXCEEDED_FOR_PAYMENT_TYPE",
    LimitExceededForMerchant = "LIMIT_EXCEEDED_FOR_MERCHANT",
    TransactionNotFound = "TRANSACTION_NOT_FOUND",
    DuplicateTransaction = "DUPLICATE_TRANSACTION",
    PaymentWalletRejected = "PAYMENT_WALLET_REJECTED",
    InsufficientMerchantInformation = "INSUFFICIENT_MERCHANT_INFORMATION",
    CrossBorderNotAcceptedUnacceptedCurrency = "CROSS_BORDER_NOT_ACCEPTED_UNACCEPTED_CURRENCY",
    GatewayServerError = "GATEWAY_SERVER_ERROR",
    PaymentMethodTemporarilyUnavailable = "PAYMENT_METHOD_TEMPORARILY_UNAVAILABLE",
    PaymentCanceled = "PAYMENT_CANCELED",
    ExceededPendingThreshold = "EXCEEDED_PENDING_THRESHOLD",
    DisputedTransaction = "DISPUTED_TRANSACTION",
    MissingThreeDSServerTransID = "MISSING_THREE_DS_SERVER_TRANS_ID",
    PaymentTypeNotSupported = "PAYMENT_TYPE_NOT_SUPPORTED",
    InvalidThreeDsStatus = "INVALID_THREE_DS_STATUS",
    CardNotEnrolledInThreeDS = "CARD_NOT_ENROLLED_IN_THREE_DS",
    ThreeDsCouldNotBeCompleted = "THREE_DS_COULD_NOT_BE_COMPLETED",
    InternalError = "INTERNAL_ERROR",

    // Charge 3DS generic error
    GenericThreeDsProcessingError = "GENERIC_THREE_DS_PROCESSING_ERROR",

    /* 309 processing errors */
    UnknownDevice = "UNKNOWN_DEVICE",
    UnsupportedDevice = "UNSUPPORTED_DEVICE",
    SecurityBreach = "SECURITY_BREACH",
    LowConfidence = "LOW_CONFIDENCE",
    MediumConfidence = "MEDIUM_CONFIDENCE",
    HighConfidence = "HIGH_CONFIDENCE",
    VeryHighConfidence = "VERY_HIGH_CONFIDENCE",
    ExceededMaxChallengeAtACS = "EXCEEDED_MAX_CHALLENGE_AT_ACS",
    NonPaymentTransactionsNotSupported = "NON_PAYMENT_TRANSACTIONS_NOT_SUPPORTED",
    ThreeRITransactionsNotSupported = "THREE_RI_TRANSACTIONS_NOT_SUPPORTED",
    TechnicalIssuesAtACS = "TECHNICAL_ISSUES_AT_ACS",
    Exceeded3DSRequestorDecoupledMaxTime = "EXCEEDED3DS_REQUESTOR_DECOUPLED_MAX_TIME",
    DecoupledAuthNotRequested = "DECOUPLED_AUTH_NOT_REQUESTED",
    InsufficientTimeForDecoupledAuth = "INSUFFICIENT_TIME_FOR_DECOUPLED_AUTH",
    AuthAttemptedButNotExecutedByCardholder = "AUTH_ATTEMPTED_BUT_NOT_EXECUTED_BY_CARDHOLDER",

    ImpersonationNotAllowed = "IMPERSONATION_NOT_ALLOWED",

    /* online */
    AlipayOnlineInvalidSignatureType = "ALIPAY_ONLINE_INVALID_SIGNATURE_TYPE",
    PayPayOnlineInvalidPayMethod = "PAY_PAY_ONLINE_INVALID_PAY_METHOD",
    PayPayOnlineInvalidMerchantId = "PAY_PAY_ONLINE_INVALID_MERCHANT_ID",

    /* validation responses */
    ChangeProhibited = "CHARGE_PROHIBITED",
    ForbiddenParameter = "FORBIDDEN_PARAMETER",
    ValidationError = "VALIDATION_ERROR",
    RequiredValue = "REQUIRED_VALUE",
    MustBeFutureTime = "MUST_BE_FUTURE_TIME",
    MustBeFutureOrToday = "MUST_BE_FUTURE_OR_TODAY",
    InvalidFormat = "INVALID_FORMAT",
    InvalidPercentFee = "INVALID_PERCENT_FEE",
    InvalidCardNumber = "INVALID_CARD_NUMBER",
    InvalidCardExpiration = "INVALID_CARD_EXPIRATION",
    InvalidCVV = "INVALID_CVV",
    InvalidFormatLength = "INVALID_FORMAT_LENGTH",
    InvalidFormatUUID = "INVALID_UUID",
    InvalidFormatBase64 = "INVALID_FORMAT_BASE64",
    InvalidFormatEmail = "INVALID_FORMAT_EMAIL",
    InvalidCardDescriptor = "INVALID_CARD_DESCRIPTOR",
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
    NotQRCharge = "NOT_QR_CHARGE",
    NotOnlineCharge = "NOT_ONLINE_CHARGE",
    IssuerTokenEmpty = "ISSUER_TOKEN_EMPTY",
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
    OnlyForCardPayment = "ONLY_FOR_CARD_PAYMENT",
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
    MediaCannotBeShortened = "MEDIA_CANNOT_BE_SHORTENED",
    InvalidChargeAmountLimit = "INVALID_CHARGE_AMOUNT_LIMIT",
    PlatformCurrencyRequiredInCvvAmount = "PLATFORM_CURRENCY_REQUIRED_IN_CVV_AMOUNT",
    TransferScheduleWaitPeriodAndPeriodRequired = "TRANSFER_SCHEDULE_WAIT_PERIOD_AND_PERIOD_REQUIRED",
    ChargeAmountTooLow = "CHARGE_AMOUNT_TOO_LOW",
    ChargeAmountTooHigh = "CHARGE_AMOUNT_TOO_HIGH",
    MustHaveAtLeastOneElement = "MUST_HAVE_AT_LEAST_ONE_ELEMENT",
    MustContainPlatformCurrency = "MUST_CONTAIN_PLATFORM_CURRENCY",
    CurrencyMustBeInAmountsList = "CURRENCY_MUST_BE_IN_AMOUNTS_LIST",
    NumberMin = "NUMBER_MIN",
    UnfinishedChargesExistForToken = "UNFINISHED_CHARGES_EXIST_FOR_TOKEN",
    OngoingSubscriptionsExistForToken = "ONGOING_SUBSCRIPTIONS_EXIST_FOR_TOKEN",
    PaymentExpirationExceedsPeriod = "PAYMENT_EXPIRATION_EXCEEDS_PERIOD",
    SchedulingOnlyForFuture = "SCHEDULING_ONLY_FOR_FUTURE",

    BrandNotDefined = "BRAND_NOT_DEFINED",

    /** Used when creating a new Merchant */
    OnlyASCII = "ONLY_ASCII",
    UniqueCharacters = "UNIQUE_CHARACTERS",
    AtLeastOneDigit = "AT_LEAST_ONE_DIGIT",
    AtLeastOneLetter = "AT_LEAST_ONE_LETTER",
    EmptyRoles = "EMPTY_ROLES",
    EditOwnRolesNotAllowed = "EDIT_OWN_ROLES_NOT_ALLOWED",
    EditOwnStatusNotAllowed = "EDIT_OWN_STATUS_NOT_ALLOWED",
    InvalidCardBrand = "INVALID_CARD_BRAND",
    UnsupportedCountry = "UNSUPPORTED_COUNTRY",
    UnsupportedCurrency = "UNSUPPORTED_CURRENCY",
    CannotBanSelf = "CANNOT_BAN_SELF",
    CannotSelfTerminate = "CANNOT_SELF_TERMINATE",
    NoDuplicateCurrencies = "NO_DUPLICATE_CURRENCIES",

    InvalidPathValue = "INVALID_PATH_VALUE",
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
    GatewayConfigurationNotRequired = "GATEWAY_CONFIGURATION_NOT_REQUIRED",

    /* Gateway simulation */
    PlatformCredentialsDisabled = "PLATFORM_CREDENTIALS_DISABLED",
    TaggedPlatformCredentialsDisabled = "TAGGED_PLATFORM_CREDENTIALS_DISABLED",
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
    NoStratusConfiguration = "NO_STRATUS_CONFIGURATION",
    PaymentTypeDisabled = "PAYMENT_TYPE_DISABLED",

    /* Refund */
    RefundExceedsChargeAmount = "REFUND_EXCEEDS_CHARGE_AMOUNT",
    CannotRefundUnsuccessfulCharge = "CANNOT_REFUND_UNSUCCESSFUL_CHARGE",
    RefundNotAllowed = "REFUND_NOT_ALLOWED",
    CancelNotAllowed = "CANCEL_NOT_ALLOWED",
    PartialRefundNotSupported = "PARTIAL_REFUND_NOT_SUPPORTED",
    RefundPercentageExceeded = "REFUND_PERCENTAGE_EXCEEDED",

    /* apple pay */
    ApplePayNotEnabled = "APPLE_PAY_NOT_ENABLED",
    ApplePayAlreadyEnabled = "APPLE_PAY_ALREADY_ENABLED",
    ApplePayCertificateAlreadySet = "APPLE_PAY_CERTIFICATE_ALREADY_SET",
    ApplePayCertificateStillInUse = "APPLE_PAY_CERTIFICATE_STILL_IN_USE",
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
    SubscriptionAlreadyEnded = "SUBSCRIPTION_ALREADY_ENDED",
    SubscriptionAlreadyCanceled = "SUBSCRIPTION_ALREADY_CANCELED",
    SubscriptionNotFound = "SUBSCRIPTION_NOT_FOUND",
    MustBeLowerThanFullAmount = "MUST_BE_LOWER_THAN_FULL_AMOUNT",
    InstallmentPlanNotFound = "INSTALLMENT_PLAN_NOT_FOUND",
    InstallmentAlreadySet = "INSTALLMENT_ALREADY_SET",
    InstallmentInvalidPlan = "INSTALLMENT_INVALID_PLAN",
    InstallmentInvalidPlanType = "INSTALLMENT_INVALID_PLAN_TYPE",
    InstallmentPaymentTypeNotAllowedForPlan = "INSTALLMENT_PAYMENT_TYPE_NOT_ALLOWED_FOR_PLAN",
    CardProcessorDisabledForInstallmentPlan = "CARD_PROCESSOR_DISABLED_FOR_INSTALLMENT_PLAN",
    CardProcessorInstallmentFutureDated = "CARD_PROCESSOR_INSTALLMENT_FUTURE_DATED",
    InstallmentInvalidInitialAmount = "INSTALLMENT_INVALID_INITIAL_AMOUNT",
    InstallmentMaxPayoutPeriodExceeded = "INSTALLMENT_MAX_PAYOUT_PERIOD_EXCEEDED",
    InstallmentInsufficientAmountPerCharge = "INSTALLMENT_INSUFFICIENT_AMOUNT_PER_CHARGE",
    InstallmentRevolvingPlanCannotSetInitialAmount = "INSTALLMENT_REVOLVING_PLAN_CANNOT_SET_INITIAL_AMOUNT",
    InstallmentRevolvingPlanCannotSetSubsequentCyclesStart = "INSTALLMENT_REVOLVING_PLAN_CANNOT_SET_SUBSEQUENT_CYCLES_START",
    InstallmentProcessorInitialAmountsNotSupported = "INSTALLMENT_PROCESSOR_INITIAL_AMOUNTS_NOT_SUPPORTED",
    InstallmentProcessorPeriodNotSupported = "INSTALLMENT_PROCESSOR_PERIOD_NOT_SUPPORTED",
    CannotChangeToken = "CANNOT_CHANGE_TOKEN",
    SubscriptionNotEnabled = "SUBSCRIPTION_NOT_ENABLED",
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
    InvalidDynamoTable = "INVALID_DYNAMO_TABLE",
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

    PaidyShippingAddressNeedsOneOptionalField = "PAIDY_SHIPPING_ADDRESS_NEEDS_ONE_OPTIONAL_FIELD",

    RevertNotAllowed = "REVERT_NOT_ALLOWED",

    /* gateway configuration errors */
    InvalidMerchantCategoryCode = "INVALID_MERCHANT_CATEGORY_CODE",

    InvalidJapanesePostalCode = "INVALID_JAPANESE_POSTAL_CODE",

    /** Bank transfer */
    MaximumExpiryExtensionExceeded = "MAXIMUM_EXPIRY_EXTENSION_EXCEEDED", // when the requested expiry is over the maximum expiry configured
    PositiveExpiryExtensionRequired = "POSITIVE_EXPIRY_EXTENSION_REQUIRED", // when the requested expiry ends up in the past
    DefaultMaximumExpiryExtensionExceeded = "DEFAULT_MAXIMUM_EXPIRY_EXTENSION_EXCEEDED", // when you try set the default maximum expiry longer than the maximum expiry
    UnderDefaultExpiryExtension = "UNDER_DEFAULT_EXPIRY_EXTENSION", // default expiry cannot be under 1 day
    EitherPeriodOrDate = "EITHER_PERIOD_OR_DATE", // can only set either the expiry period + optional time shift or absolute date
    MaximumExtensionsReached = "MAXIMUM_EXTENSIONS_REACHED", // Reached the max num of expiry extensions

    /* EC checkout API */
    InvalidSubscriptionCycles = "INVALID_SUBSCRIPTION_CYCLES",
    InvalidSubscriptionStartOn = "INVALID_SUBSCRIPTION_START_ON",
    InvalidSubscriptionPeriod = "INVALID_SUBSCRIPTION_PERIOD",
    InvalidSubscriptionInitialAmount = "INVALID_SUBSCRIPTION_INITIAL_AMOUNT",
    InvalidSubscriptionStartDayOfTheMonth = "INVALID_SUBSCRIPTION_START_DAY_OF_MONTH",
    PeerSubscriptionStartDayOfTheMonthRequired = "PEER_SUBSCRIPTION_START_DAY_OF_MONTH_REQUIRED",
    PeerSubscriptionStartInMonthConflict = "PEER_SUBSCRIPTION_START_IN_MONTHS_CONFLICT",
    InvalidDuration = "INVALID_DURATION",
    AnyUnknown = "ANY_UNKNOWN",
    InvalidFormatUuid = "INVALID_FORMAT_UUID",
    DateGreater = "DATE_GREATER",

    /* Refer */
    CustomerLoginNotEnabled = "CUSTOMER_LOGIN_NOT_ENABLED",
    InvalidStoreId = "INVALID_STORE_ID",
    InvalidEmailAddress = "INVALID_EMAIL_ADDRESS",
    ExpiredOTPToken = "EXPIRED_OTP_TOKEN",

    /* Invalid card error (lowercased errors) */
    CountryNotAllowed = "country_not_allowed",
}

export enum PaymentErrorType {
    NotSelectedReasons = "not_selected_reasons",
}

export enum NotSelectedReason {
    DescriptorNotSupported = "descriptor_not_supported",
    GatewayAlreadyUsed = "gateway_already_used",
    ChargeWithoutCVVNotSupported = "charge_without_cvv_not_supported",
    CardBrandNotSupported = "card_brand_not_supported",
    CountryNotSupported = "country_not_supported",
    ModeNotSupported = "mode_not_supported",
    AuthCaptureNotSupported = "auth_capture_not_supported",
    CvvAuthNotSupported = "cvv_auth_not_supported",
    CustomerIpAddressMissing = "customer_ip_address_missing",
    PaymentTypeNotSupported = "payment_type_not_supported",
    NotActive = "not_active",
    GatewayNotAvailable = "gateway_not_available",
    GatewayNotSupported = "gateway_not_supported",
    PlatformNotSupported = "platform_not_supported",
    MerchantNotSupported = "merchant_not_supported",
    StoreNotSupported = "store_not_supported",
    DoesNotMatchRequestedCurrency = "does_not_match_requested_currency",
    RateLimited = "rate_limited",
    GatewayConfigNotFound = "gateway_config_not_found",
    LastNameRequired = "last_name_required",

    NotChosenGatewayForQRCode = "not_chosen_gateway_for_qr_code",
    NotChosenGateway = "not_chosen_gateway",
    CallMethodNotSupported = "call_method_not_supported",
    OSTypeNotSpecified = "os_type_not_specified",
    SubscriptionPlanValidationFailed = "subscription_plan_validation_failed",
    InstallmentCapableNotMatching = "installment_capable_not_matching",
    CardBankIssuerNotSupported = "card_bank_issuer_not_supported",
    CardBinNotSupported = "card_bin_not_supported",
    CurrencyNotSupported = "currency_not_supported",
    AuthCaptureSupportNotMatching = "auth_capture_support_not_matching",

    NotOnWhitelist = "not_on_whitelist",
    BlacklistedTagOnMerchant = "blacklisted_tag_on_merchant",
    BlacklistedTagOnStore = "blacklisted_tag_on_store",
    ForbiddenGateway = "forbidden_gateway",
    ForbiddenCredential = "forbidden_credential",
    CannotShareMerchantCredentials = "cannot_share_merchant_credentials",
    CannotShareStoreCredentials = "cannot_share_store_credentials",
    PlatformCredentialsDisabled = "platform_credentials_disabled",
    TaggedPlatformCredentialsDisabled = "tagged_platform_credentials_disabled",
}

type PaymentSubError = {
    type: PaymentErrorType;
    message: NotSelectedReason[];
    credentialId: string;
};

export type PaymentError = {
    message: string;
    code: number;
    details?: string;
    others?: PaymentSubError[];
};

export class APIError extends Error {
    name = "APIError";
    status: number;
    response: Record<string, any>;

    constructor(status: number, response?: Record<string, any>) {
        super(`API request failed with status ${status}`);
        this.status = status;
        this.response = Object.keys(response || {}).length !== 0 ? response : null;
        Object.setPrototypeOf(this, APIError.prototype);
    }
}
