/**
 *  @module Resources/Platforms
 */

import { AuthParams, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import { CardBrand } from "./common/enums";
import { PlatformConfiguration as PlatformConfig, PlatformItem } from "./common/Platform";
import { WithConfig } from "./common/types";
import { CRUDResource } from "./CRUDResource";
import { PaymentType } from "./TransactionTokens";

/* Request */

/* Response */
export interface PlatformConfigurationItem extends PlatformItem, WithConfig<PlatformConfig> {
    supportedPaymentTypes?: PaymentType[];
    supportedCardBrands?: CardBrand[];
}

export type ResponsePlatformConfiguration = Readonly<PlatformConfigurationItem>;

export class Platforms extends CRUDResource {
    getConfiguration(
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponsePlatformConfiguration>
    ): Promise<ResponsePlatformConfiguration> {
        return this.defineRoute(HTTPMethod.GET, "/platform", undefined, false)(data, callback, auth);
    }
}
