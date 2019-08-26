import uuid from 'uuid';
import { StoreItem } from '../../src/resources/Stores';
import { generateFixture as generateConfiguration } from './common/configuration';

export function generateFixture(): StoreItem {
    return {
        id: uuid(),
        merchantId: uuid(),
        name: 'Store',
        configuration: generateConfiguration(),
        createdOn: new Date().toISOString(),
    };
}
