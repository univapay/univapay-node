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
import { BankTransferBrand, CardBrand, OnlineBrand, ProcessingMode } from "./common/enums.js";
import { AmountWithCurrency } from "./common/types.js";
import { DefinedRoute, Resource } from "./Resource.js";
import { OnlineCallMethod, OSType, PaymentType, RecurringTokenPrivilege } from "./TransactionTokens.js";

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
    brand: CardBrand | OnlineBrand | "paidy" | BankTransferBrand;
    supportAuthCapture: boolean;
    requiresFullName: boolean;
    supportDynamicDescriptor: boolean;
    requiresCvv: boolean;
    countriesAllowed?: string[] | null;
    supportedCurrencies: string[];
    paymentType: PaymentType;

    /**
     * @deprecated
     */
    cardBrand?: CardBrand;

    /**
     * @deprecated
     */
    onlineBrand?: OnlineBrand;
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

export type CheckoutInfoBrandPayload = {
    amount: number;
    currency: string;
    callMethod: OnlineCallMethod;

    /**
     * Required when callMethod is "app", "sdk" or "http_get_mobile". Leave empty for the rest
     */
    osType?: OSType;

    /**
     * WeChat Online authorization code for 'web' call method
     */
    authorizationCode?: string;
};

type CheckoutInfoBrandItemBrand = {
    brandName: string;
    brandDisplayName: string;
    extras: {
        logos?: {
            logoName: string;
            logoUrl: string;
            logoPattern: string;
            logoWidth: string;
            logoHeight: string;
        }[];
        promoNames?: string[]; // list of stringified transactions
    };
};

export type AlipayPlusOnlineCheckoutInfoBrandItem = {
    service: OnlineBrand;
    serviceName: string;
    brands: CheckoutInfoBrandItemBrand[];
};

export type WeChatOnlineCheckoutInfoBrandItem = {
    appId: string;
    openId: CheckoutInfoBrandItemBrand[];
};

export type ResponseCheckoutInfo = CheckoutInfoItem;

export class CheckoutInfo extends Resource {
    private _get?: DefinedRoute;
    get(data?: SendData<CheckoutInfoParams>, auth?: AuthParams): Promise<ResponseCheckoutInfo> {
        this._get = this._get ?? this.defineRoute(HTTPMethod.GET, "/checkout_info");
        return this._get(data, auth);
    }

    private _gateway?: DefinedRoute;
    gateway(
        brand: OnlineBrand,
        data?: SendData<CheckoutInfoBrandPayload>,
        auth?: AuthParams
    ): Promise<AlipayPlusOnlineCheckoutInfoBrandItem | WeChatOnlineCheckoutInfoBrandItem> {
        this._gateway = this._gateway ?? this.defineRoute(HTTPMethod.POST, "/checkout_info/gateways/:brand");
        return this._gateway(data, auth, { brand });
    }
}
