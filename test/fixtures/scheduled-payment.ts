import { v4 as uuid } from "uuid";

import { ScheduledPaymentItem } from "../../src/resources/Subscriptions";

export const generateFixture = (): ScheduledPaymentItem => ({
    id: uuid(),
    dueDate: new Date().toISOString(),
    zoneId: uuid(),
    amount: 1000,
    amountFormatted: 1000,
    currency: "JPY",
    isPaid: true,
    isLastPayment: false,
    createdOn: new Date().toISOString(),
});
