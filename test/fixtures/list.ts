import { CRUDItemsResponse } from '../../src/resources/CRUDResource';

export interface FixtureListOptions<Record> {
    count?: number;
    hasMore?: boolean;
    recordGenerator?: () => Record;
}

export function generateList<Record>(options?: FixtureListOptions<Record>): CRUDItemsResponse<Record> {
    const { count = 0, hasMore = true, recordGenerator } = { ...options };

    const items = [];

    if (count > 0 && typeof recordGenerator === 'function') {
        for (let i = 0; i < count; i++) {
            items.push(recordGenerator());
        }
    }

    return {
        items,
        hasMore,
    };
}
