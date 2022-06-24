/**
 *  @module Resources/Merchants
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { ConfigurationItem } from "./common/Configuration.js";
import { TransferScheduleItem } from "./common/TransferSchedule.js";
import { CRUDResource } from "./CRUDResource.js";

/* Request */

/* Response */
export interface MerchantConfigurationItem extends ConfigurationItem {
    waitPeriod?: string;
    transferSchedule?: TransferScheduleItem;
}

export interface MerchantItem {
    id: string;
    verificationDataId?: string;
    name: string;
    email: string;
    verified: boolean;
    createdOn: string;
    configuration: MerchantConfigurationItem;
    notificationEmail?: string;
}

export type ResponseMerchant = MerchantItem;

export interface MerchantBanParams {
    reason: string;
}

export class Merchants extends CRUDResource {
    me(data?: SendData<void>, auth?: AuthParams): Promise<ResponseMerchant> {
        return this.defineRoute(HTTPMethod.GET, "/me")(data, auth);
    }
}
