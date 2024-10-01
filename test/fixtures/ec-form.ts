import { v4 as uuid } from "uuid";

import { OnlineBrand, ProcessingMode } from "../../src/resources/common/enums.js";
import { CheckoutType, ECFormCustomField, ECFormItem, ECFormCustomFieldType } from "../../src/resources/ECForms.js";
import { PaymentType, TransactionTokenType } from "../../src/resources/TransactionTokens.js";

const generateECFormCustomField = (): ECFormCustomField => ({
    key: "test-key",
    label: "Test label",
    type: ECFormCustomFieldType.SELECT,
    required: false,
    options: ["Test option 1", "Test option 2"],
});

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
    mode: ProcessingMode.LIVE,

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
        "test-test": "dummy-data",
    },
    customFieldsTitles: {
        en_us: "Test english field title",
        ja_jp: "Test japanese field title",
        zh_tw: "Test taiwanese field title",
    },
    orderSummaryTitles: {
        en_us: "Test englishorder  title",
        ja_jp: "Test japanese order title",
        zh_tw: "Test taiwanese order title",
    },
    customFields: {
        en_us: [generateECFormCustomField()],
        ja_jp: [generateECFormCustomField()],
        zh_tw: [generateECFormCustomField()],
    },
});
