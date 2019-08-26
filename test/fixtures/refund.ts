import uuid from 'uuid';
import { ProcessingMode } from '../../src/resources/common/enums';
import { RefundItem, RefundStatus, RefundReason } from '../../src/resources/Refunds';

export function generateFixture(): RefundItem {
    return {
        id: uuid(),
        chargeId: uuid(),
        storeId: uuid(),
        ledgerId: uuid(),
        status: RefundStatus.SUCCESSFUL,
        amount: 1000,
        currency: 'JPY',
        amountFormatted: 1000,
        reason: RefundReason.CUSTOMER_REQUEST,
        message: 'Refund',
        metadata: {},
        mode: ProcessingMode.TEST,
        createdOn: new Date().toISOString(),
    };
}
