/* Request */
import { HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import { Resource } from "./Resource";

export interface ExchangeRateParams {
    amount: number;
    currency: string;
    to: string;
}

/* Response */
export interface ExchangeRateItem {
    amount: number;
    currency: string;
}

export type ResponseExchangeRate = ExchangeRateItem;

export class ExchangeRates extends Resource {
    calculate(
        data: SendData<ExchangeRateParams>,
        callback?: ResponseCallback<ResponseExchangeRate>
    ): Promise<ResponseExchangeRate> {
        return this.defineRoute(HTTPMethod.POST, "/exchange_rates/calculate")(data, callback);
    }
}
