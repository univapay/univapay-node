import {
    BankTransferConfiguration,
    CardConfigurationItem,
    ConfigurationItem,
    InstallmentsConfigurationItem,
    PaymentTypeConfiguration,
    QRScanConfigurationItem,
    SubscriptionsConfiguration,
    TransferMatchAmount,
    ConvenienceConfigurationItem,
    SubscriptionPlanConfiguration,
    CustomerRole,
    Period,
    DirectDebitConfiguration,
    DirectDebitTransferDateType,
} from "../../../src/resources/common/Configuration.js";
import { CardBrand, ProcessingMode } from "../../../src/resources/common/enums.js";

export const generateFixturePaymentType = (): PaymentTypeConfiguration => ({
    enabled: true,
});

export const generateFixtureQRScanConfiguration = (): QRScanConfigurationItem => ({
    ...generateFixturePaymentType(),
    forbiddenQrScanGateways: [],
});

export const generateFixtureCardConfiguration = (): CardConfigurationItem => ({
    ...generateFixturePaymentType(),
    debitEnabled: true,
    debitAuthorizationEnabled: true,
    prepaidEnabled: true,
    prepaidAuthorizationEnabled: true,
    forbiddenCardBrands: [CardBrand.AMEX],
    foreignCardsAllowed: true,
    failOnNewEmail: false,
    allowedCountriesByIp: ["JP"],
    allowEmptyCvv: false,
    cardLimit: {
        amount: 1000,
        currency: "JPY",
        duration: "P1D",
    },
    onlyDirectCurrency: false,
    allowDirectTokenCreation: true,
    threeDsRequired: false,
    threeDsAddressRequired: false,
    threeDsSkipEnabled: false,
});

export const generateFixtureSubscriptionPlanConfiguration = (): SubscriptionPlanConfiguration => ({
    enabled: true,
    fixedCycle: true,
    fixedCycleAmount: true,
    supportedPaymentTypes: null,
    minChargeAmount: {
        amount: 100,
        amountFormatted: "100",
        currency: "JPY",
    },
    maxPayoutPeriod: "P1Y",
});

export const generateFixtureInstallmentConfiguration = (): InstallmentsConfigurationItem => ({
    ...generateFixturePaymentType(),
    enabled: true,
    onlyWithProcessor: false,
    minChargeAmount: { amount: 1000, currency: "JPY" },
    maxPayoutPeriod: "P7D",
    failedCyclesToCancel: 3,
    cardProcessor: { fixedCycle: true, revolving: false },
});

export const generateFixtureSubscriptionConfiguration = (): SubscriptionsConfiguration => ({
    failedChargesToCancel: 5,
    suspendOnCancel: true,
    allowMerchantDueDatePatch: true,
});

export const generateFixtureBankTransferConfiguration = (): BankTransferConfiguration => ({
    enabled: true,
    matchAmount: TransferMatchAmount.EXACT,
    expiration: "P7D",
    virtualBankAccountsThreshold: 20,
    virtualBankAccountsFetchCount: 10,

    expirationTimeShift: { enabled: true, value: "09:00:00.000+09:00" },
    defaultExtensionPeriod: "P1D",
    maximumExtensionPeriod: "P2D",
    automaticExtensionEnabled: true,
    remindNotificationEnabled: true,
    remindNotificationPeriod: "P1D",
    chargeRequestNotificationEnabled: true,
    depositReceivedNotificationEnabled: true,
    depositInsufficientNotificationEnabled: true,
    depositExceededNotificationEnabled: true,
    extensionNotificationEnabled: true,
});

export const generateFixtureConvenienceConfiguration = (): ConvenienceConfigurationItem => ({
    enabled: true,
    expiration: "P7D",
    expirationTimeShift: { enabled: true, value: "09:00:00.000+09:00" },
});

export const generateFixtureDirectDebitConfiguration = (): DirectDebitConfiguration => ({
    enabled: true,
    legacyId: "dummy-legacy-id",
    debitDate: DirectDebitTransferDateType.MIDDLE_OF_MONTH,
    consignorCode: "0001",
    signature: "dummy-name",
    classifier: "1324512345",
});

export const generateFixture = (): ConfigurationItem => ({
    cardBrandPercentFees: {},
    cardConfiguration: generateFixtureCardConfiguration(),
    qrScanConfiguration: generateFixtureQRScanConfiguration(),
    qrMerchantConfiguration: generateFixturePaymentType(),
    convenienceConfiguration: generateFixtureConvenienceConfiguration(),
    paidyConfiguration: generateFixturePaymentType(),
    onlineConfiguration: generateFixturePaymentType(),
    bankTransferConfiguration: generateFixtureBankTransferConfiguration(),
    directDebitConfiguration: generateFixtureDirectDebitConfiguration(),
    customerManagementConfiguration: {
        enabled: true,
        defaultRoles: [CustomerRole.SUBSCRIPTION_READ],
        defaultMode: ProcessingMode.TEST,
    },
    flatFees: [{ amount: 30, currency: "JPY" }],
    percentFee: 3.5,
    logoUrl: "http://fake.com/logo.jpg",
    securityConfiguration: {
        inspectSuspiciousLoginAfter: "P7D",
        limitChargeByCardConfiguration: {
            quantityOfCharges: 1000,
            durationWindow: "P1M",
        },
        refundPercentLimit: 5,
        minRefundThreshold: 5,
        restrictIpAfterFailedCharge: {
            enabled: true,
            count: 50,
            cooldown: "P1S",
        },
        limitRefundBySales: {
            enabled: true,
            period: Period.ANNUALLY,
            rollingWindow: true,
        },
    },
    installmentsConfiguration: generateFixtureInstallmentConfiguration(),
    minimumChargeAmounts: [],
    maximumChargeAmounts: [],
    country: "JP",
    language: "ja_JP",
    displayTimeZone: "Asia/Tokyo",
    recurringTokenConfiguration: {},
    subscriptionConfiguration: {
        enabled: true,
        suspendOnCancel: true,
        failedChargesToCancel: 10,
        allowMerchantDueDatePatch: true,
    },
    checkoutConfiguration: {
        ecEmail: { enabled: true },
        ecProducts: { enabled: true },
    },
    descriptorProvidedConfiguration: {
        name: "test descriptor",
        phoneNumber: "+81123456789",
    },
});
