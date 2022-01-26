/**
 *  @module Resources/ECForms
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI";

import { OnlineBrand } from "./common/enums";
import { AmountWithCurrency } from "./common/types";
import { CRUDResource } from "./CRUDResource";
import { InstallmentPlan, SubscriptionPeriod } from "./Subscriptions";
import { PaymentType, TransactionTokenType, UsageLimit } from "./TransactionTokens";

type BaseMetadata = Record<string, string>;

export enum CheckoutType {
    PAYMENT = "payment",
    TOKEN = "token",
}

export enum ECFormCustomFieldType {
    STRING = "string",
    SELECT = "select",
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
    customFieldsTitles?: Partial<Record<"jaJp" | "enUs", string>> | null;
    orderSummaryTitles?: Partial<Record<"jaJp" | "enUs", string>> | null;
    customFields?: Partial<Record<"jaJp" | "enUs", ECFormCustomField[]>> | null;
};

export type ResponseECForm<Metadata = BaseMetadata> = ECFormItem<Metadata>;

export class ECForms extends CRUDResource {
    static requiredParams: string[] = [];
    static routeBase = "/checkout/forms";

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ECFormItem>
    ): Promise<ResponseECForm> {
        return this._getRoute()(data, callback, auth, { id });
    }
}
