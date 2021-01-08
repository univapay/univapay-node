import {
    CardConfigurationItem,
    ConfigurationItem,
    InstallmentsConfigurationItem,
    PaymentTypeConfiguration,
    QRScanConfigurationItem,
    SubscriptionsConfiguration,
} from "../../../src/resources/common/Configuration";
import { CardBrand } from "../../../src/resources/common/enums";

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
    prepaidEnabled: true,
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
});

export const generateFixtureInstallmentConfiguration = (): InstallmentsConfigurationItem => ({
    ...generateFixturePaymentType(),
    enabled: true,
    onlyWithProcessor: false,
    minChargeAmount: { amount: 1000, currency: "JPY" },
    maxPayoutPeriod: "P7D",
    failedCyclesToCancel: 3,
});

export const generateFixtureSubscriptionConfiguration = (): SubscriptionsConfiguration => ({
    failedChargesToCancel: 5,
    suspendOnCancel: true,
});

export const generateFixture = (): ConfigurationItem => ({
    cardBrandPercentFees: {},
    cardConfiguration: generateFixtureCardConfiguration(),
    qrScanConfiguration: generateFixtureQRScanConfiguration(),
    qrMerchantConfiguration: generateFixturePaymentType(),
    convenienceConfiguration: generateFixturePaymentType(),
    paidyConfiguration: generateFixturePaymentType(),
    onlineConfiguration: generateFixturePaymentType(),
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
    },
    installmentsConfiguration: generateFixtureInstallmentConfiguration(),
    maximumChargeAmounts: [],
    country: "JP",
    language: "ja_JP",
    displayTimeZone: "Asia/Tokyo",
    recurringTokenConfiguration: {},
    subscriptionConfiguration: {
        enabled: true,
        suspendOnCancel: true,
        failedChargesToCancel: 10,
    },
    descriptorProvidedConfiguration: {
        name: "test descriptor",
        phoneNumber: "+81123456789",
    },
});
