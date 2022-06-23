/**
 *  @module Resources/Charges
 */

import { AuthParams, HTTPMethod, PollData, PollParams, ResponseCallback, SendData } from "../api/RestAPI.js";

import { PaymentError } from "../errors/APIError.js";
import { ProcessingMode } from "./common/enums.js";
import { ignoreDescriptor } from "./common/ignoreDescriptor.js";
import { Metadata, WithStoreMerchantName } from "./common/types.js";
import { CaptureStatus } from "./Captures.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { TransactionTokenType } from "./TransactionTokens.js";

export enum ChargeStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error",
    CANCELED = "canceled",
    AWAITING = "awaiting",
    AUTHORIZED = "authorized",
}

/* Request */
export type ChargesListParams = CRUDPaginationParams;

export interface ChargeCreateParams<T extends Metadata = Metadata> {
    transactionTokenId: string;
    amount: number;
    currency: string;
    captureAt?: string | number;
    capture?: boolean;
    descriptor?: string;
    ignoreDescriptorOnError?: boolean;
    onlyDirectCurrency?: boolean;
    metadata?: T;
}

export type ChargeIssuerTokenGetParams = void;

/* Response */
export interface ChargeItem<T extends Metadata = Metadata> {
    id: string;
    merchantId: string;
    storeId: string;
    ledgerId?: string;
    subscriptionId?: string;
    requestedAmount: number;
    requestedCurrency: string;
    requestedAmountFormatted: number;
    chargedAmount: number;
    chargedCurrency: string;
    chargedAmountFormatted: number;
    captureAt?: string;
    captureStatus?: CaptureStatus;
    status: ChargeStatus;
    error?: PaymentError;
    metadata?: T;
    mode: ProcessingMode;
    createdOn: string;
    transactionTokenId?: string;
    transactionTokenType: TransactionTokenType;
    descriptor: string;
    onlyDirectCurrency: boolean;
}
export interface IssuerTokenItem {
    issuerToken: string;
    callMethod: "http_get" | "http_post" | "sdk";
}

export type ChargeListItem = WithStoreMerchantName<ChargeItem>;

export type ResponseCharge = ChargeItem;
export type ResponseCharges = CRUDItemsResponse<ChargeListItem>;

export type ResponseIssuerToken = IssuerTokenItem;

export class Charges extends CRUDResource {
    static requiredParams: string[] = ["transactionTokenId", "amount", "currency"];

    static routeBase = "/stores/:storeId/charges";

    list(
        data?: SendData<ChargesListParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCharges>,
        storeId?: string
    ): Promise<ResponseCharges> {
        return this.defineRoute(HTTPMethod.GET, "(/stores/:storeId)/charges")(data, callback, auth, { storeId });
    }

    async create(
        data: SendData<ChargeCreateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCharge>
    ): Promise<ResponseCharge> {
        return ignoreDescriptor(
            (updatedData: ChargeCreateParams) =>
                this.defineRoute(HTTPMethod.POST, "/charges", Charges.requiredParams)(updatedData, callback, auth),
            data
        );
    }

    get(
        storeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCharge>
    ): Promise<ResponseCharge> {
        return this._getRoute()(data, callback, auth, { storeId, id });
    }

    getIssuerToken(
        storeId: string,
        chargeId: string,
        data?: SendData<ChargeIssuerTokenGetParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseIssuerToken>
    ): Promise<ResponseIssuerToken> {
        return this.defineRoute(HTTPMethod.GET, "/stores/:storeId/charges/:chargeId/issuerToken")(
            data,
            callback,
            auth,
            { storeId, chargeId }
        );
    }

    poll(
        storeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseCharge>,
        pollParams?: Partial<PollParams<ResponseCharge>>
    ): Promise<ResponseCharge> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseCharge> = () => this.get(storeId, id, pollData, auth);
        const successCondition = pollParams?.successCondition || (({ status }) => status !== ChargeStatus.PENDING);

        return this.api.longPolling(promise, { ...pollParams, successCondition }, callback);
    }
}
