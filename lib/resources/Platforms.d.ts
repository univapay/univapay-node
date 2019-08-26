/**
 *  @module Resources/Platforms
 */
import { ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
import { CardBrand } from './common/enums';
import { PlatformItem, PlatformConfiguration as PlatformConfig } from './common/Platform';
import { WithConfig } from './common/types';
import { PaymentType } from './TransactionTokens';
export interface PlatformConfigurationItem extends PlatformItem, WithConfig<PlatformConfig> {
    supportedPaymentTypes?: PaymentType[];
    supportedCardBrands?: CardBrand[];
}
export declare type ResponsePlatformConfiguration = Readonly<PlatformConfigurationItem>;
export declare class Platforms extends CRUDResource {
    getConfiguration(data?: SendData<void>, callback?: ResponseCallback<ResponsePlatformConfiguration>): Promise<ResponsePlatformConfiguration>;
}
