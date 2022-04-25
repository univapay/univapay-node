import { v4 as uuid } from "uuid";

import { CancelItem, CancelStatus } from "../../src/resources/Cancels.js";
import { ProcessingMode } from "../../src/resources/common/enums.js";

export const generateFixture = (): CancelItem => ({
    id: uuid(),
    chargeId: uuid(),
    storeId: uuid(),
    status: CancelStatus.SUCCESSFUL,
    metadata: {},
    mode: ProcessingMode.TEST,
    createdOn: new Date().toISOString(),
});
