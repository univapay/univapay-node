/**
 *  @module Resources/Charges
 */

import { HTTPMethod, PollParams, ResponseCallback, SendData } from "../api/RestAPI";

import { ProcessingMode } from "./common/enums";
import { ignoreDescriptor } from "./common/ignoreDescriptor";
import { Metadata, PaymentError } from "./common/types";
import { CaptureStatus } from "./Captures";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";
import { TransactionTokenType } from "./TransactionTokens";

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

export interface ChargeCreateParams {
    transactionTokenId: string;
    amount: number;
    currency: string;
    captureAt?: string | number;
    capture?: boolean;
    descriptor?: string;
    ignoreDescriptorOnError?: boolean;
    onlyDirectCurrency?: boolean;
    metadata?: Metadata;
}

/* Response */
export interface ChargeItem {
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
    metadata?: Metadata;
    mode: ProcessingMode;
    createdOn: string;
    transactionTokenId?: string;
    transactionTokenType: TransactionTokenType;
    descriptor: string;
    onlyDirectCurrency: boolean;
}

export type ResponseCharge = ChargeItem;
export type ResponseCharges = CRUDItemsResponse<ChargeItem>;

export class Charges extends CRUDResource {
    static requiredParams: string[] = ["transactionTokenId", "amount", "currency"];

    static routeBase = "/stores/:storeId/charges";

    list(
        data?: SendData<ChargesListParams>,
        callback?: ResponseCallback<ResponseCharges>,
        storeId?: string
    ): Promise<ResponseCharges> {
        return this.defineRoute(HTTPMethod.GET, "(/stores/:storeId)/charges")(data, callback, ["storeId"], storeId);
    }

    async create(
        data: SendData<ChargeCreateParams>,
        callback?: ResponseCallback<ResponseCharge>
    ): Promise<ResponseCharge> {
        return ignoreDescriptor(
            (updatedData: ChargeCreateParams) =>
                this.defineRoute(HTTPMethod.POST, "/charges", Charges.requiredParams)(updatedData, callback),
            data
        );
    }

    get(
        storeId: string,
        id: string,
        data?: SendData<PollParams>,
        callback?: ResponseCallback<ResponseCharge>
    ): Promise<ResponseCharge> {
        return this._getRoute()(data, callback, ["storeId", "id"], storeId, id);
    }

    poll(
        storeId: string,
        id: string,
        data?: SendData<PollParams>,
        callback?: ResponseCallback<ResponseCharge>,

        /**
         * Condition for the resource to be successfully loaded. Default to pending status check.
         */
        cancelCondition?: (response: ResponseCharge) => boolean,
        successCondition: ({ status }: ResponseCharge) => boolean = ({ status }) => status !== ChargeStatus.PENDING
    ): Promise<ResponseCharge> {
        const pollingData = { ...data, polling: true };
        const promise: () => Promise<ResponseCharge> = () => this.get(storeId, id, pollingData);

        return this.api.longPolling(promise, successCondition, cancelCondition, callback);
    }
}
