/**
 *  @module Resources/ECFormLinks
 */
import { AuthParams, SendData } from "../api/RestAPI.js";

import { Metadata } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
import { SubscriptionPeriod } from "./Subscriptions.js";
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
    hideCvv?: boolean;
    metadata?: Metadata;

    // Recurring
    cvvAuthorize?: boolean;

    // One time
    chargeAuth?: boolean;
    chargeCaptureOn?: string;
    chargeCaptureIn?: string;

    /**
     * Boolean when the card installment select should be shown to the end user
     * null for subscriptions
     */
    allowCardInstallments: boolean | null;

    // Subscription
    subscriptionStartOn?: string;
    subscriptionStartIn?: string;
    subscriptionStartInMonths?: number;
    subscriptionStartDayOfMonth?: number;
    subscriptionInitialAmount?: number;
    subscriptionCycles?: number;

    /**
     * ISO 8601 period. e.g P1M, P23D. Can not be used with the `period` parameter
     */
    subscriptionCyclicalPeriod?: string | null;
    subscriptionPeriod?: SubscriptionPeriod;
};

export type ResponseECFormLink = ECFormLinkItem;

export class ECFormLinks extends CRUDResource {
    static routeBase = "/checkout/links";

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseECFormLink> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }
}
