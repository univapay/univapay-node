import { v4 as uuid } from "uuid";

import { CardBrand, ProcessingMode } from "../../src/resources/common/enums.js";
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
import { CustomerRole } from "../../src/resources/common/Configuration.js";

export const generateFixture = (): PlatformConfigurationItem => ({
    id: uuid(),
    domain: "fake.com",
    name: "Platform",
    configuration: {
        timeZone: "Asia/Tokyo",
        adminEmailAddresses: ["test@fake.com"],
        notifyUserTransactions: true,
        notifyUserOnFailedTransactions: false,
        defaultLanguage: "JA_JP",
        supportedLanguages: ["JA_JP"],
        country: "JP",
        currency: "JPY",
        displayImages: {
            placeholderUri: "http://fake.com/logo.jpg",
        },
        foreignCardsEnabled: true,
        userDefaults: {
            percentFee: 3.5,
            transferSchedule: generateTransferSchedule(),
            flatFees: [{ amount: 30, currency: "JPY" }],
            waitPeriod: "P7D",
            cardBrandPercentFees: {},
            customerManagementConfiguration: {
                enabled: true,
                defaultRoles: [
                    CustomerRole.SUBSCRIPTION_READ,
                    CustomerRole.SUBSCRIPTION_UPDATE_TOKEN,
                    CustomerRole.TRANSACTION_TOKEN_READ,
                    CustomerRole.TRANSACTION_TOKEN_READ,
                ],
                defaultMode: ProcessingMode.TEST,
            },
            cardConfiguration: {
                allowDirectTokenCreation: true,
                threeDsRequired: false,
                threeDsAddressRequired: false,
                threeDsSkipEnabled: false,
            },
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
