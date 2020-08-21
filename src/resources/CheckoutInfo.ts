/**
 *  @module Resources/CheckoutInfo
 */

import { AuthParams, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import {
    CardConfigurationItem,
    ConvenienceConfigurationItem,
    OnlineConfigurationItem,
    PaidyConfigurationItem,
    QRScanConfigurationItem,
} from "./common/Configuration";
import { CardBrand, ProcessingMode } from "./common/enums";
import { AmountWithCurrency } from "./common/types";
import { Resource } from "./Resource";
import { RecurringTokenPrivilege } from "./TransactionTokens";

/* Request */
export interface CheckoutInfoParams {
    // @deprecated
    origin?: string;
}

/* Response */
export interface CheckoutColors {
    mainBackground: string;
    secondaryBackground: string;
    mainColor: string;
    mainText: string;
    primaryText: string;
    secondaryText: string;
    baseText: string;
}

export interface SupportedBrand {
    cardBrand: CardBrand;
    supportAuthCapture: boolean;
    requiresFullName: boolean;
    supportDynamicDescriptor: boolean;
    requiresCvv: boolean;
    countriesAllowed?: string[];
    supportedCurrencies: string[];
}

export interface CheckoutInfoItem {
    mode: ProcessingMode;
    recurringTokenPrivilege: RecurringTokenPrivilege;
    name: string;
    cardConfiguration: CardConfigurationItem;
    qrScanConfiguration: QRScanConfigurationItem;
    convenienceConfiguration: ConvenienceConfigurationItem;
    paidyConfiguration: PaidyConfigurationItem;
    onlineConfiguration: OnlineConfigurationItem;
    paidyPublicKey: string;
    recurringCardChargeCvvConfirmation: {
        enabled?: boolean;
        threshold?: AmountWithCurrency[];
    };
    logoImage?: string;
    theme: {
        colors: CheckoutColors;
    };
    supportedBrands: SupportedBrand[];
}

export type ResponseCheckoutInfo = CheckoutInfoItem;

export class CheckoutInfo extends Resource {
    get(
        data?: SendData<CheckoutInfoParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCheckoutInfo>
    ): Promise<ResponseCheckoutInfo> {
        return this.defineRoute(HTTPMethod.GET, "/checkout_info")(data, callback, auth);
    }
}
