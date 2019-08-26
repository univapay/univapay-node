import { CardBrand, ProcessingMode } from '../../src/resources/common/enums';
import { CheckoutInfoItem } from '../../src/resources/CheckoutInfo';
import { RecurringTokenPrivilege } from '../../src/resources/TransactionTokens';
import {
    generateFixturePaymentType,
    generateFixtureCardConfiguration,
    generateFixtureQRScanConfiguration,
} from './common/configuration';
import uuid from 'uuid';

export function generateFixture(): CheckoutInfoItem {
    return {
        mode: ProcessingMode.TEST,
        name: 'Checkout',
        recurringTokenPrivilege: RecurringTokenPrivilege.NONE,
        cardConfiguration: generateFixtureCardConfiguration(),
        qrScanConfiguration: generateFixtureQRScanConfiguration(),
        convenienceConfiguration: generateFixturePaymentType(),
        paidyConfiguration: generateFixturePaymentType(),
        paidyPublicKey: uuid(),
        recurringCardChargeCvvConfirmation: {
            enabled: false,
        },
        logoImage: 'http://fake.com/logo.jpg',
        theme: {
            colors: {
                mainBackground: '#000',
                secondaryBackground: '#000',
                mainColor: '#000',
                mainText: '#000',
                primaryText: '#000',
                secondaryText: '#000',
                baseText: '#000',
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
                supportedCurrencies: ['JPY'],
            },
        ],
    };
}
