import {
    CardConfigurationItem,
    PaymentTypeConfiguration,
    ConfigurationItem,
    InstallmentsConfigurationItem,
    SubscriptionsConfiguration,
    QRScanConfigurationItem,
} from '../../../src/resources/common/Configuration';
import { CardBrand } from '../../../src/resources/common/enums';

export function generateFixturePaymentType(): PaymentTypeConfiguration {
    return {
        enabled: true,
    };
}

export function generateFixtureQRScanConfiguration(): QRScanConfigurationItem {
    return { ...generateFixturePaymentType(), forbiddenQrScanGateways: [] };
}

export function generateFixtureCardConfiguration(): CardConfigurationItem {
    return {
        ...generateFixturePaymentType(),
        debitEnabled: true,
        prepaidEnabled: true,
        forbiddenCardBrands: [CardBrand.AMEX],
        foreignCardsAllowed: true,
        failOnNewEmail: false,
        allowedCountriesByIp: ['JP'],
        allowEmptyCvv: false,
        cardLimit: {
            amount: 1000,
            currency: 'JPY',
        },
        onlyDirectCurrency: false,
    };
}

export function generateFixtureInstallmentConfiguration(): InstallmentsConfigurationItem {
    return {
        ...generateFixturePaymentType(),
        enabled: true,
        onlyWithProcessor: false,
        minChargeAmount: 1000,
        maxPayoutPeriod: 'P7D',
        failedCyclesToCancel: 3,
    };
}

export function generateFixtureSubscriptionConfiguration(): SubscriptionsConfiguration {
    return {
        failedChargesToCancel: 5,
        suspendOnCancel: true,
    };
}

export function generateFixture(): ConfigurationItem {
    return {
        cardBrandPercentFees: {},
        cardConfiguration: generateFixtureCardConfiguration(),
        qrScanConfiguration: generateFixtureQRScanConfiguration(),
        qrMerchantConfiguration: generateFixturePaymentType(),
        convenienceConfiguration: generateFixturePaymentType(),
        paidyConfiguration: generateFixturePaymentType(),
        flatFees: [{ amount: 30, currency: 'JPY' }],
        percentFee: 3.5,
        logoUrl: 'http://fake.com/logo.jpg',
        securityConfiguration: {
            inspectSuspiciousLoginAfter: 'TODO',
            limitChargeByCardConfiguration: {
                quantityOfCharges: 1000,
                durationWindow: 'P1M',
            },
            refundPercentLimit: 5,
        },
        installmentsConfiguration: generateFixtureInstallmentConfiguration(),
        maximumChargeAmounts: [],
        country: 'JP',
        language: 'ja_JP',
        displayTimeZone: 'Asia/Tokyo',
        recurringTokenConfiguration: {},
        subscriptionConfiguration: {
            suspendOnCancel: true,
            failedChargesToCancel: 10,
        },
        descriptorProvidedConfiguration: {
            name: 'test descriptor',
            phoneNumber: '+81123456789',
        },
    };
}
