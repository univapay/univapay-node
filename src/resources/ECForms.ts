/**
 *  @module Resources/ECForms
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

import { OnlineBrand } from "./common/enums.js";
import { AmountWithCurrency } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { InstallmentPlan, SubscriptionPeriod } from "./Subscriptions.js";
import { PaymentType, TransactionTokenType, UsageLimit } from "./TransactionTokens.js";

type BaseMetadata = Record<string, string>;

export enum CheckoutType {
    PAYMENT = "payment",
    TOKEN = "token",
}

export enum ECFormCustomFieldType {
    STRING = "string",
    SELECT = "select",
}

export enum Languages {
    EN_US = "en_us",
    JA_JP = "ja_jp",
    ZH_TW = "zh_tw",
}

export type ECFormCustomField = {
    key: string;
    label: string;
    type: ECFormCustomFieldType;
    required?: boolean;
    options?: string[];
};

export type ECFormItem<Metadata = BaseMetadata> = {
    /* EC Form data */
    id: string;
    merchantId: string;
    storeId: string;
    name: string;
    createdOn: string;

    /* Redirects */
    successRedirectUrl?: string | null;
    failureRedirectUrl?: string | null;
    pendingRedirectUrl?: string | null;
    autoRedirect?: boolean;

    /* Charge and token data */
    appId: string;
    checkout: CheckoutType;
    paymentType?: PaymentType | null;
    tokenType: TransactionTokenType;
    univapayCustomerId: string | null;
    capture: boolean;
    captureAt?: string | null;
    onlyDirectCurrency?: boolean;
    supportedPaymentMethods: (PaymentType | OnlineBrand)[];

    /* Display */
    title: string | null;
    description: string | null;
    confirmationRequired: boolean;
    locale: string | null;
    header: string | null;
    dark: boolean;
    submitButtonText?: string | null;
    showCvv: boolean;
    displayStoreName: boolean;
    displayStoreLogo: boolean;
    headerColor?: string | null;
    buttonColor?: string | null;
    backgroundColor?: string | null;

    /* Subscription */
    subscriptionId?: string | null;
    subscriptionPeriod?: SubscriptionPeriod | null;
    subscriptionInitialAmount?: AmountWithCurrency | null;
    subscriptionStart?: string | null;
    installmentPlan?: InstallmentPlan | null;
    installmentQty?: number | null;
    installmentAmount?: AmountWithCurrency | null;
    subscriptionTimezone?: string | null;
    subscriptionPreserveEndOfMonth?: boolean | null;

    /* Recurring token */
    usageLimit?: UsageLimit | null;
    cvvAuthorize: boolean;

    /* Address */
    address?: boolean | null;
    requireName?: boolean | null;
    requireNameKana?: boolean | null;
    requireEmail?: boolean | null;
    requireBillingAddress?: boolean | null;
    requirePhoneNumber?: boolean | null;
    email?: string | null;
    shippingAddressLine1: string | null;
    shippingAddressLine2: string | null;
    shippingAddressCity: string | null;
    shippingAddressState: string | null;
    shippingAddressZip: string | null;
    shippingAddressCountryCode: string | null;
    buyerName: string | null;
    buyerNameTransliteration: string | null;
    buyerDateOfBirth: string | null;

    /* Metadata */
    descriptor: string | null;
    ignoreDescriptorOnError: boolean | null;
    metadata: Metadata | null;
    customFieldsTitles?: Partial<Record<Languages, string>> | null;
    orderSummaryTitles?: Partial<Record<Languages, string>> | null;
    customFields?: Partial<Record<Languages, ECFormCustomField[]>> | null;
};

export type ResponseECForm<Metadata = BaseMetadata> = ECFormItem<Metadata>;

export class ECForms extends CRUDResource {
    static requiredParams: string[] = [];
    static routeBase = "/checkout/forms";

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseECForm> {
        const ignoreKeysFormatting = ["metadata", ...Object.values(Languages)];
        this._get = this._get ?? this._getRoute({ ignoreKeysFormatting });
        return this._get(data, auth, { id });
    }
}
