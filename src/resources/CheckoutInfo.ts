/**
 *  @module Resources/CheckoutInfo
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import {
    BankTransferConfiguration,
    CardConfigurationItem,
    ConvenienceConfigurationItem,
    OnlineConfigurationItem,
    PaidyConfigurationItem,
    QRScanConfigurationItem,
} from "./common/Configuration.js";
import { CardBrand, OnlineBrand, ProcessingMode } from "./common/enums.js";
import { AmountWithCurrency } from "./common/types.js";
import { DefinedRoute, Resource } from "./Resource.js";
import { RecurringTokenPrivilege } from "./TransactionTokens.js";

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
    cardBrand?: CardBrand;
    onlineBrand?: OnlineBrand;
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
    bankTransferConfiguration: BankTransferConfiguration;
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
    installmentsConfiguration: {
        enabled: boolean;
        onlyWithProcessor: boolean;
    };
    logoImage?: string;
    theme: {
        colors: CheckoutColors;
    };
    supportedBrands: SupportedBrand[];
}

export type ResponseCheckoutInfo = CheckoutInfoItem;

export class CheckoutInfo extends Resource {
    private _get?: DefinedRoute;
    get(data?: SendData<CheckoutInfoParams>, auth?: AuthParams): Promise<ResponseCheckoutInfo> {
        this._get = this._get ?? this.defineRoute(HTTPMethod.GET, "/checkout_info");
        return this._get(data, auth);
    }
}
