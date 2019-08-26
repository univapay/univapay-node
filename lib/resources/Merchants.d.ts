/**
 *  @module Resources/Merchants
 */
import { ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
import { ConfigurationItem } from './common/Configuration';
import { TransferScheduleItem } from './common/TransferSchedule';
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
}
export declare type ResponseMerchant = MerchantItem;
export interface MerchantBanParams {
    reason: string;
}
export declare class Merchants extends CRUDResource {
    me(data?: SendData<void>, callback?: ResponseCallback<ResponseMerchant>): Promise<ResponseMerchant>;
}
