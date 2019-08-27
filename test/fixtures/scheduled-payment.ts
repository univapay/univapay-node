import uuid from 'uuid';
import { ScheduledPaymentItem } from '../../src/resources/Subscriptions';

export function generateFixture(): ScheduledPaymentItem {
    return {
        id: uuid(),
        dueDate: new Date().toISOString(),
        zoneId: uuid(),
        amount: 1000,
        amountFormatted: 1000,
        currency: 'JPY',
        isPaid: true,
        isLastPayment: false,
        createdOn: new Date().toISOString(),
    };
}
