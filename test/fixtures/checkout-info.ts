import { v4 as uuid } from "uuid";

import { CheckoutInfoItem } from "../../src/resources/CheckoutInfo.js";
import { CardBrand, ProcessingMode } from "../../src/resources/common/enums.js";
import { RecurringTokenPrivilege } from "../../src/resources/TransactionTokens.js";

import {
    generateFixtureBankTransferConfiguration,
    generateFixtureCardConfiguration,
    generateFixturePaymentType,
    generateFixtureQRScanConfiguration,
} from "./common/configuration.js";

export const generateFixture = (): CheckoutInfoItem => ({
    mode: ProcessingMode.TEST,
    name: "Checkout",
    recurringTokenPrivilege: RecurringTokenPrivilege.NONE,
    cardConfiguration: generateFixtureCardConfiguration(),
    qrScanConfiguration: generateFixtureQRScanConfiguration(),
    convenienceConfiguration: generateFixturePaymentType(),
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
            cardBrand: CardBrand.MASTERCARD,
            supportAuthCapture: true,
            requiresFullName: false,
            supportDynamicDescriptor: true,
            requiresCvv: true,
            countriesAllowed: null,
            supportedCurrencies: ["JPY"],
        },
    ],
});
