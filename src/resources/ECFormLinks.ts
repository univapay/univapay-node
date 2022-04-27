/**
 *  @module Resources/ECFormLinks
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI.js";

import { Metadata } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { InstallmentPlan, SubscriptionPeriod } from "./Subscriptions.js";
import { TransactionTokenType } from "./TransactionTokens.js";

export type ECFormLinkItem = {
    id: string;
    merchantId: string;
    storeId: string;
    formId: string;

    description: string | null;

    enabled: boolean;
    expiry: string | null;
    jwt: string;
    secret: string;

    amount: number;
    amountFormatted: string;
    currency: string;
    createdOn: string;
    updatedOn: string;

    tokenType: TransactionTokenType;
    tokenOnly: boolean;
    metadata?: Metadata;

    // Recurring
    cvvAuthorize?: boolean;

    // One time
    chargeAuth?: boolean;
    chargeCaptureOn?: string;
    chargeCaptureIn?: string;

    // Subscription
    subscriptionStartOn?: string;
    subscriptionStartIn?: string;
    subscriptionInitialAmount?: number;
    subscriptionPeriod?: SubscriptionPeriod;

    // Installment
    installmentPlan?: InstallmentPlan;
    installmentCycles?: number;
    installmentCycleAmount?: number;
};

export type ResponseECFormLink = ECFormLinkItem;

export class ECFormLinks extends CRUDResource {
    static routeBase = "/checkout/links";

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseECFormLink>
    ): Promise<ResponseECFormLink> {
        return this._getRoute()(data, callback, auth, { id });
    }
}
