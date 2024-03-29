import { v4 as uuid } from "uuid";

import { AlipayPlusOnlineCheckoutInfoBrandItem, CheckoutInfoItem } from "../../src/resources/CheckoutInfo.js";
import { CardBrand, OnlineBrand, ProcessingMode } from "../../src/resources/common/enums.js";
import { PaymentType, RecurringTokenPrivilege } from "../../src/resources/TransactionTokens.js";

import {
    generateFixtureBankTransferConfiguration,
    generateFixtureCardConfiguration,
    generateFixturePaymentType,
    generateFixtureQRScanConfiguration,
    generateFixtureConvenienceConfiguration,
} from "./common/configuration.js";

export const generateFixture = (): CheckoutInfoItem => ({
    mode: ProcessingMode.TEST,
    name: "Checkout",
    recurringTokenPrivilege: RecurringTokenPrivilege.NONE,
    cardConfiguration: generateFixtureCardConfiguration(),
    qrScanConfiguration: generateFixtureQRScanConfiguration(),
    convenienceConfiguration: generateFixtureConvenienceConfiguration(),
    paidyConfiguration: generateFixturePaymentType(),
    onlineConfiguration: generateFixturePaymentType(),
    bankTransferConfiguration: generateFixtureBankTransferConfiguration(),
    paidyPublicKey: uuid(),
    recurringCardChargeCvvConfirmation: {
        enabled: false,
    },
    installmentsConfiguration: {
        enabled: true,
        onlyWithProcessor: false,
    },
    logoImage: "http://fake.com/logo.jpg",
    theme: {
        colors: {
            mainBackground: "#000",
            secondaryBackground: "#000",
            mainColor: "#000",
            mainText: "#000",
            primaryText: "#000",
            secondaryText: "#000",
            baseText: "#000",
        },
    },
    supportedBrands: [
        {
            brand: CardBrand.MASTERCARD,
            cardBrand: CardBrand.MASTERCARD,
            supportAuthCapture: true,
            requiresFullName: false,
            supportDynamicDescriptor: true,
            requiresCvv: true,
            countriesAllowed: null,
            supportedCurrencies: ["JPY"],
            paymentType: PaymentType.CARD,
        },
    ],
});

export const generateGatewayFixture = (): AlipayPlusOnlineCheckoutInfoBrandItem => ({
    service: OnlineBrand.ALIPAY_PLUS_ONLINE,
    serviceName: "Alipay+",
    brands: [
        {
            brandName: "CONNECT_WALLET",
            brandDisplayName: "Alipay+",
            extras: {
                logos: [
                    {
                        logoName: "Alipay+",
                        logoUrl:
                            "https://cdn.marmot-cloud.com/storage/aplus-checkout-prod/icon/prod/CONNECT_WALLET_TEST.png",
                        logoPattern: "default",
                        logoWidth: "810",
                        logoHeight: "190",
                    },
                ],
                promoNames: ['{"en_US":"A+ Cashier Promotion Test","fil_PH":"A+ Cashier Promotion Test"}'],
            },
        },
    ],
});
