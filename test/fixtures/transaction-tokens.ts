import { v4 as uuid } from "uuid";

import { CardBrand, CardType, ProcessingMode } from "../../src/resources/common/enums.js";
import { PaymentType, TransactionTokenItem, TransactionTokenType } from "../../src/resources/TransactionTokens.js";

export const generateFixture = (): TransactionTokenItem => ({
    id: uuid(),
    storeId: uuid(),
    email: "test@fake.com",
    mode: ProcessingMode.TEST,
    paymentType: PaymentType.CARD,
    createdOn: new Date().toISOString(),
    lastUsedOn: new Date().toISOString(),
    type: TransactionTokenType.ONE_TIME,
    data: {
        card: {
            cardholder: "Joe Doe",
            expMonth: 12,
            expYear: 99,
            lastFour: "4242",
            brand: CardBrand.VISA,
            cardType: CardType.CREDIT,
            country: "JP",
            cardBin: "400002",
        },
        billing: {
            line1: "Test",
            line2: "Test",
            state: "Tokyo",
            city: "Tokyo",
            country: "JP",
            zip: "111-1111",
            phoneNumber: {
                countryCode: "81",
                localNumber: "123456789",
            },
        },
    },
});
