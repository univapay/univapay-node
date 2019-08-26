import uuid from 'uuid';
import { CardBrand, ProcessingMode, CardType } from '../../src/resources/common/enums';
import { PaymentType, TransactionTokenItem, TransactionTokenType } from '../../src/resources/TransactionTokens';

export function generateFixture(): TransactionTokenItem {
    return {
        id: uuid(),
        storeId: uuid(),
        email: 'test@fake.com',
        mode: ProcessingMode.TEST,
        paymentType: PaymentType.CARD,
        createdOn: new Date().toISOString(),
        lastUsedOn: new Date().toISOString(),
        type: TransactionTokenType.ONE_TIME,
        data: {
            card: {
                cardholder: 'Joe Doe',
                expMonth: '12',
                expYear: '99',
                lastFour: '4242',
                brand: CardBrand.VISA,
                cardType: CardType.CREDIT,
                country: 'JP',
            },
            billing: {
                line1: 'Test',
                line2: 'Test',
                state: 'Tokyo',
                city: 'Tokyo',
                country: 'JP',
                zip: '111-1111',
                phoneNumber: {
                    countryCode: '81',
                    localNumber: '123456789',
                },
            },
        },
    };
}
