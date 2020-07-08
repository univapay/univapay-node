import { v4 as uuid } from "uuid";

import { WebHookItem, WebHookTrigger } from "../../src/resources/WebHooks";

export const generateFixture = (): WebHookItem => ({
    id: uuid(),
    merchantId: uuid(),
    storeId: uuid(),
    triggers: [WebHookTrigger.CHARGE_FINISHED],
    url: "http://fake.com",
    createdOn: new Date().toISOString(),
});
