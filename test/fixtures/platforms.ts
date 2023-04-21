import { v4 as uuid } from "uuid";

import { CardBrand } from "../../src/resources/common/enums.js";
import { PlatformConfigurationItem } from "../../src/resources/Platforms.js";
import { PaymentType } from "../../src/resources/TransactionTokens.js";

import {
    generateFixtureBankTransferConfiguration,
    generateFixtureInstallmentConfiguration,
    generateFixtureSubscriptionConfiguration,
    generateFixtureConvenienceConfiguration,
    generateFixtureSubscriptionPlanConfiguration,
} from "./common/configuration.js";
import { generateFixture as generateTransferSchedule } from "./common/transfer-schedule.js";

export const generateFixture = (): PlatformConfigurationItem => ({
    id: uuid(),
    domain: "fake.com",
    name: "Platform",
    configuration: {
        timeZone: "Asia/Tokyo",
        adminEmailAddresses: ["test@fake.com"],
        notifyUserTransactions: true,
        defaultLanguage: "JA_JP",
        supportedLanguages: ["JA_JP"],
        country: "JP",
        currency: "JPY",
        displayImages: {
            placeholderUri: "http://fake.com/logo.jpg",
        },
        userDefaults: {
            percentFee: 3.5,
            transferSchedule: generateTransferSchedule(),
            flatFees: [{ amount: 30, currency: "JPY" }],
            waitPeriod: "P7D",
            cardBrandPercentFees: {},
            minTransferPayout: {
                amount: 1000,
                currency: "JPY",
            },
            bankTransferConfiguration: generateFixtureBankTransferConfiguration(),
            checkoutConfiguration: {
                ecEmail: { enabled: true },
                ecProducts: { enabled: true },
            },
            convenienceConfiguration: generateFixtureConvenienceConfiguration(),
            installmentsConfiguration: generateFixtureInstallmentConfiguration(),
            subscriptionConfiguration: generateFixtureSubscriptionConfiguration(),
            subscriptionPlanConfiguration: generateFixtureSubscriptionPlanConfiguration(),
            onlyDirectCurrency: false,
            platformCredentialsEnabled: true,
            taggedPlatformCredentialsEnabled: true,
            minRefundThreshold: 5,
        },
        refundPercentLimit: 5,
        paymentDefaults: {
            cardsEnabled: true,
            qrScanEnabled: true,
            qrMerchantEnabled: true,
            prepaidEnabled: true,
            prepaidAuthorizationEnabled: true,
            debitEnabled: true,
            debitAuthorizationEnabled: true,
            convenienceEnabled: true,
            paidyEnabled: true,
            onlineEnabled: true,
            bankTransferEnabled: true,
        },
        maximumChargeAmounts: [],
        minimumChargeAmounts: [],
    },
    supportedPaymentTypes: [PaymentType.CARD],
    supportedCardBrands: [CardBrand.VISA],
    createdOn: new Date().toISOString(),
    invoiceChargeFee: [
        {
            chargeVolume: 0,
            chargeInvoiceFee: 100,
        },
    ],
});
