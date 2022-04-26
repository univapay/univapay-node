/* Request */
import { AuthParams, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI.js";

import { Resource } from "./Resource.js";

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
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseExchangeRate>
    ): Promise<ResponseExchangeRate> {
        return this.defineRoute(HTTPMethod.POST, "/exchange_rates/calculate")(data, callback, auth);
    }
}
