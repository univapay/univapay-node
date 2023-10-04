/**
 *  @module Resources/Charges
 */

import { AuthParams, HTTPMethod, PollData, PollParams, SendData } from "../api/RestAPI.js";

import { PaymentError } from "../errors/APIError.js";
import { ProcessingMode } from "./common/enums.js";
import { ignoreDescriptor } from "./common/ignoreDescriptor.js";
import { Metadata, WithStoreMerchantName } from "./common/types.js";
import { CaptureStatus } from "./Captures.js";
import { CRUDAOSItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { TransactionTokenType } from "./TransactionTokens.js";
import { DefinedRoute } from "./Resource.js";

export enum ChargeStatus {
    PENDING = "pending",
    SUCCESSFUL = "successful",
    FAILED = "failed",
    ERROR = "error",
    CANCELED = "canceled",
    AWAITING = "awaiting",
    AUTHORIZED = "authorized",
}

export type ChargeExpiry = {
    id: string;
    chargeId: string;
    expirationDate: string;
    extensionCount: number;
    createdOn: string;
    updatedOn: string;
};

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
    redirect?: {
        endpoint: string;
    };
    feeAmount?: number | null;
    feeCurrency?: string | null;
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
    redirect?: {
        redirectId?: string;
    };
    feeAmount?: number | null;
    feeCurrency?: string | null;
    feeAmountFormatted?: string | null;
}
export interface IssuerTokenItem {
    issuerToken: string;
    callMethod: "http_get" | "http_post" | "sdk";
}

export type ChargeListItem = WithStoreMerchantName<ChargeItem>;

export type ResponseCharge = ChargeItem;
export type ResponseCharges = CRUDAOSItemsResponse<ChargeListItem>;

export type ResponseIssuerToken = IssuerTokenItem;

export class Charges extends CRUDResource {
    static requiredParams: string[] = ["transactionTokenId", "amount", "currency"];
    static routeBase = "/stores/:storeId/charges";

    private _list?: DefinedRoute;
    list(data?: SendData<ChargesListParams>, auth?: AuthParams, storeId?: string): Promise<ResponseCharges> {
        this._list = this._list ?? this.defineRoute(HTTPMethod.GET, "(/stores/:storeId)/charges");
        return this._list(data, auth, { storeId });
    }

    async create(data: SendData<ChargeCreateParams>, auth?: AuthParams): Promise<ResponseCharge> {
        return ignoreDescriptor(
            (updatedData: ChargeCreateParams) =>
                this.defineRoute(HTTPMethod.POST, "/charges", { requiredParams: Charges.requiredParams })(
                    updatedData,
                    auth,
                ),
            data,
        );
    }

    private _get?: DefinedRoute;
    get(storeId: string, id: string, data?: SendData<PollData>, auth?: AuthParams): Promise<ResponseCharge> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, id });
    }

    private _getIssuerToken?: DefinedRoute;
    getIssuerToken(
        storeId: string,
        chargeId: string,
        data?: SendData<ChargeIssuerTokenGetParams>,
        auth?: AuthParams,
    ): Promise<ResponseIssuerToken> {
        this._getIssuerToken =
            this._getIssuerToken ?? this.defineRoute(HTTPMethod.GET, "/stores/:storeId/charges/:chargeId/issuerToken");
        return this._getIssuerToken(data, auth, { storeId, chargeId });
    }

    poll(
        storeId: string,
        id: string,
        data?: SendData<PollData>,
        auth?: AuthParams,
        pollParams?: Partial<PollParams<ResponseCharge>>,
    ): Promise<ResponseCharge> {
        const pollData = { ...data, polling: true };
        const promise: () => Promise<ResponseCharge> = () => this.get(storeId, id, pollData, auth);
        const successCondition = pollParams?.successCondition ?? (({ status }) => status !== ChargeStatus.PENDING);

        return this.api.longPolling(promise, { ...pollParams, successCondition });
    }

    private _expiry?: DefinedRoute;
    expiry(id: string, data?: SendData<void>, auth?: AuthParams, storeId?: string): Promise<ChargeExpiry> {
        this._expiry = this._expiry ?? this.defineRoute(HTTPMethod.GET, "/stores/:storeId/charges/:id/expiry/latest");
        return this._expiry(data, auth, { storeId, id });
    }
}
