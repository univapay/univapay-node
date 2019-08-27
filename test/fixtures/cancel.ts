import uuid from 'uuid';
import { ProcessingMode } from '../../src/resources/common/enums';
import { CancelItem, CancelStatus } from '../../src/resources/Cancels';

export function generateFixture(): CancelItem {
    return {
        id: uuid(),
        chargeId: uuid(),
        storeId: uuid(),
        status: CancelStatus.SUCCESSFUL,
        metadata: {},
        mode: ProcessingMode.TEST,
        createdOn: new Date().toISOString(),
    };
}
