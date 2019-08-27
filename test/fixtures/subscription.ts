import uuid from 'uuid';
import {
    InstallmentPlan,
    SubscriptionItem,
    SubscriptionPeriod,
    SubscriptionStatus,
} from '../../src/resources/Subscriptions';
import { ProcessingMode } from '../../src/resources/common/enums';
import { generateFixture as generatePayment } from './scheduled-payment';

export function generateFixture(): SubscriptionItem {
    return {
        id: uuid(),
        storeId: uuid(),
        transactionTokenId: uuid(),
        amount: 1000,
        currency: 'JPY',
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
        subsequentCyclesStart: '',
        paymentsLeft: 4,
        scheduleSettings: {
            startOn: new Date().toISOString(),
            zoneId: 'Asia/Tokyo',
            preserveEndOfMonth: true,
        },
        installmentPlan: InstallmentPlan.FIXED_CYCLES,
        nextPayment: generatePayment(),
        descriptor: 'test',
        onlyDirectCurrency: false,
    };
}
