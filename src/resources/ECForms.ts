/**
 *  @module Resources/ECForms
 */

import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI";

import { CRUDResource } from "./CRUDResource";
import { InstallmentPlan, SubscriptionPeriod } from "./Subscriptions";
import { PaymentType, TransactionTokenType, UsageLimit } from "./TransactionTokens";

export enum CheckoutType {
    PAYMENT = "payment",
    TOKEN = "token",
}

export type ECFormItem<Metadata = Record<string, string>> = {
    appId: string;
    checkout: CheckoutType;
    paymentType: PaymentType;
    tokenType: TransactionTokenType;
    univapayCustomerId: string;
    capture: boolean;
    captureAt: string;
    onlyDirectCurrency: boolean;

    /* Display */
    title: string;
    description: string;
    confirmationRequired: boolean;
    locale: string;
    header: string;
    dark: boolean;
    submitButtonText?: string;
    showCvv: boolean;

    /* Subscription */
    subscriptionPeriod: SubscriptionPeriod;
    subscriptionId: string;
    subscriptionInitialAmount: number;
    subscriptionStart: string;
    installmentPlan: InstallmentPlan;
    installmentQty: number;
    subscriptionTimezone: string;
    subscriptionPreserveEndOfMonth: boolean;

    /* Recurring token */
    usageLimit: UsageLimit;
    cvvAuthorize: boolean;

    /* Address */
    address: boolean;
    requireEmail?: boolean;
    requireBillingAddress?: boolean;
    email: string;
    shippingAddressLine1: string;
    shippingAddressLine2: string;
    shippingAddressCity: string;
    shippingAddressState: string;
    shippingAddressZip: string;
    shippingAddressCountryCode: string;
    buyerName: string;
    buyerNameTransliteration: string;
    buyerDateOfBirth: string;

    /* Metadata */
    descriptor: string;
    ignoreDescriptorOnError: boolean;
    metadata: Metadata;
};

export type ResponseECForm = ECFormItem;

export class ECForms extends CRUDResource {
    static requiredParams: string[] = [];

    static routeBase = "/forms/:id";

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseECForm>
    ): Promise<ResponseECForm> {
        return this._getRoute()(data, callback, auth, { id });
    }
}
