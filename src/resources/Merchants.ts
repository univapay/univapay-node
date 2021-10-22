/**
 *  @module Resources/Merchants
 */

import { AuthParams, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import { ConfigurationItem } from "./common/Configuration";
import { TransferScheduleItem } from "./common/TransferSchedule";
import { CRUDResource } from "./CRUDResource";

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
    me(
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseMerchant>
    ): Promise<ResponseMerchant> {
        return this.defineRoute(HTTPMethod.GET, "/me")(data, callback, auth);
    }
}
