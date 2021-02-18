import { v4 as uuid } from "uuid";

import { OnlineBrand } from "../../src/resources/common/enums";
import { CheckoutType, ECFormItem } from "../../src/resources/ECForms";
import { PaymentType, TransactionTokenType } from "../../src/resources/TransactionTokens";

export const generateFixture = (): ECFormItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    createdOn: new Date().toISOString(),
    name: "Dummy ec form name",
    appId: "dummy-app-id",
    checkout: CheckoutType.PAYMENT,
    paymentType: PaymentType.CARD,
    tokenType: TransactionTokenType.ONE_TIME,
    univapayCustomerId: uuid(),
    capture: false,
    onlyDirectCurrency: false,
    displayStoreName: true,
    displayStoreLogo: false,

    supportedPaymentMethods: [PaymentType.CARD, PaymentType.KONBINI, OnlineBrand.PAY_PAY_ONLINE],

    /* Display */
    title: "Dummy title",
    description: "Dummy description",
    confirmationRequired: false,
    locale: null,
    header: null,
    dark: false,
    submitButtonText: "Dummy submit button text",
    showCvv: true,

    /* Recurring token */
    usageLimit: null,
    cvvAuthorize: false,

    /* Address */
    address: null,
    requireEmail: true,
    requireBillingAddress: true,
    email: "test@univapay.com",
    shippingAddressLine1: null,
    shippingAddressLine2: null,
    shippingAddressCity: null,
    shippingAddressState: null,
    shippingAddressZip: null,
    shippingAddressCountryCode: null,
    buyerName: null,
    buyerNameTransliteration: null,
    buyerDateOfBirth: null,

    /* Metadata */
    descriptor: "dummy-descriptor",
    ignoreDescriptorOnError: false,
    metadata: {
        test: "dummy-data",
    },
});
