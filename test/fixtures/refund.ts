import { v4 as uuid } from "uuid";

import { ProcessingMode } from "../../src/resources/common/enums.js";
import { RefundItem, RefundReason, RefundStatus } from "../../src/resources/Refunds.js";

export const generateFixture = (): RefundItem => ({
    id: uuid(),
    chargeId: uuid(),
    storeId: uuid(),
    ledgerId: uuid(),
    status: RefundStatus.SUCCESSFUL,
    amount: 1000,
    currency: "JPY",
    amountFormatted: 1000,
    reason: RefundReason.CUSTOMER_REQUEST,
    message: "Refund",
    metadata: {},
    mode: ProcessingMode.TEST,
    createdOn: new Date().toISOString(),
    updatedOn: new Date().toISOString(),
});
