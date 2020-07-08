import { v4 as uuid } from "uuid";

import { TransferItem, TransferStatus, TransferStatusChangeItem } from "../../src/resources/Transfers";

export const generateFixture = (): TransferItem => ({
    id: uuid(),
    merchantId: uuid(),
    bankAccountId: uuid(),
    amount: 1000,
    currency: "JPY",
    amountFormatted: 1000,
    status: TransferStatus.PAID,
    startedBy: uuid(),
    createdOn: new Date().toISOString(),
    from: new Date().toISOString(),
    to: new Date().toISOString(),
    metadata: {},
});

export const generateFixtureTransferStatusChange = (): TransferStatusChangeItem => ({
    id: uuid(),
    merchantId: uuid(),
    transferId: uuid(),
    oldStatus: TransferStatus.CREATED,
    newStatus: TransferStatus.APPROVED,
    reason: "Reason",
    createdOn: new Date().toISOString(),
});
