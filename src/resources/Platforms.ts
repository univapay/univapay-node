/**
 *  @module Resources/Platforms
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { CardBrand } from "./common/enums.js";
import { PlatformConfiguration as PlatformConfig, PlatformItem } from "./common/Platform.js";
import { WithConfig } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { PaymentType } from "./TransactionTokens.js";

/* Request */

/* Response */
export interface PlatformConfigurationItem extends PlatformItem, WithConfig<PlatformConfig> {
    supportedPaymentTypes?: PaymentType[];
    supportedCardBrands?: CardBrand[];
}

export type ResponsePlatformConfiguration = Readonly<PlatformConfigurationItem>;

export class Platforms extends CRUDResource {
    getConfiguration(data?: SendData<void>, auth?: AuthParams): Promise<ResponsePlatformConfiguration> {
        return this.defineRoute(HTTPMethod.GET, "/platform", { requireAuth: false })(data, auth);
    }
}
