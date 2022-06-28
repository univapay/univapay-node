/* Request */
import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { DefinedRoute, Resource } from "./Resource.js";

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
    private _calculate: DefinedRoute;
    calculate(data: SendData<ExchangeRateParams>, auth?: AuthParams): Promise<ResponseExchangeRate> {
        this._calculate = this._calculate ?? this.defineRoute(HTTPMethod.POST, "/exchange_rates/calculate");
        return this._calculate(data, auth);
    }
}
