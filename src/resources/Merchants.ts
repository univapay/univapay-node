/**
 *  @module Resources/Merchants
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { ConfigurationItem } from "./common/Configuration.js";
import { TransferScheduleItem } from "./common/TransferSchedule.js";
import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

/* Request */

/* Response */
export type MerchantConfigurationItem = ConfigurationItem & {
    waitPeriod?: string;
    transferSchedule?: TransferScheduleItem;
};

export type MerchantItem = {
    id: string;
    verificationDataId?: string;
    name: string;
    email: string;
    verified: boolean;
    createdOn: string;
    configuration: MerchantConfigurationItem;
    notificationEmail?: string;
    financeNotificationEmail?: string;
};

export type ResponseMerchant = MerchantItem;

export type MerchantBanParams = {
    reason: string;
};

export class Merchants extends CRUDResource {
    private _me?: DefinedRoute;
    me(data?: SendData<void>, auth?: AuthParams): Promise<ResponseMerchant> {
        this._me = this._me ?? this.defineRoute(HTTPMethod.GET, "/me");
        return this._me(data, auth);
    }
}
