import { v4 as uuid } from "uuid";

import { ProcessingMode } from "../../src/resources/common/enums";
import {
    InstallmentPlan,
    SubscriptionItem,
    SubscriptionPeriod,
    SubscriptionStatus,
} from "../../src/resources/Subscriptions";

import { generateFixture as generatePayment } from "./scheduled-payment";

export const generateFixture = (overrides?: Partial<SubscriptionItem>): SubscriptionItem => ({
    id: uuid(),
    storeId: uuid(),
    transactionTokenId: uuid(),
    amount: 1000,
    currency: "JPY",
    amountFormatted: 1000,
    period: SubscriptionPeriod.MONTHLY,
    status: SubscriptionStatus.CURRENT,
    metadata: {},
    mode: ProcessingMode.TEST,
    createdOn: new Date().toISOString(),
    amountLeft: 1000,
    amountLeftFormatted: 1000,
    initialAmount: 1000,
    initialAmountFormatted: 1000,
    subsequentCyclesStart: "",
    paymentsLeft: 4,
    scheduleSettings: {
        startOn: new Date().toISOString(),
        zoneId: "Asia/Tokyo",
        preserveEndOfMonth: true,
    },
    installmentPlan: InstallmentPlan.FIXED_CYCLES,
    nextPayment: generatePayment(),
    descriptor: "test",
    onlyDirectCurrency: false,
    ...overrides,
});
