import { ExchangeRateItem } from '../../src/resources/ExchangeRates';

export function generateFixture(): ExchangeRateItem {
    return {
        amount: 5000,
        currency: 'jpy',
    };
}
