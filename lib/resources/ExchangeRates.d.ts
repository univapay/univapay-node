import { Resource } from './Resource';
import { ResponseCallback, SendData } from '../api/RestAPI';
export interface ExchangeRateParams {
    amount: number;
    currency: string;
    to: string;
}
export interface ExchangeRateItem {
    amount: number;
    currency: string;
}
export declare type ResponseExchangeRate = ExchangeRateItem;
export declare class ExchangeRates extends Resource {
    calculate(data: SendData<ExchangeRateParams>, callback?: ResponseCallback<ResponseExchangeRate>): Promise<ResponseExchangeRate>;
}
