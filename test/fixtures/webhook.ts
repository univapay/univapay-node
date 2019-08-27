import uuid from 'uuid';
import { WebHookItem, WebHookTrigger } from '../../src/resources/WebHooks';

export function generateFixture(): WebHookItem {
    return {
        id: uuid(),
        merchantId: uuid(),
        storeId: uuid(),
        triggers: [WebHookTrigger.CHARGE_FINISHED],
        url: 'http://fake.com',
        createdOn: new Date().toISOString(),
    };
}
