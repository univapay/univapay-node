/**
 *  @module Resources/TransactionTokens
 */

import { ErrorResponse, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import { CardBrand, CardCategory, CardSubBrand, CardType, ProcessingMode, QRBrand, QRGateway } from "./common/enums";
import { Metadata, PhoneNumber } from "./common/types";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource";

export enum UsageLimit {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    ANNUALLY = "annually",
}

export enum PaymentType {
    CARD = "card",
    QR_SCAN = "qr_scan",
    KONBINI = "konbini",
    APPLE_PAY = "apple_pay",
    PAIDY = "paidy",
    QR_MERCHANT = "qr_merchant",
}

export enum ConvenienceStore {
    SEVEN_ELEVEN = "seven_eleven",
    FAMILY_MART = "family_mart",
    LAWSON = "lawson",
    MINI_STOP = "mini_stop",
    SEICO_MART = "seico_mart",
    PAY_EASY = "pay_easy",
    CIRCLE_K = "circle_k",
    SUNKUS = "sunkus",
    DAILY_YAMAZAKI = "daily_yamazaki",
    YAMAZAKI_DAILY_STORE = "yamazaki_daily_store",
}

export enum TransactionTokenType {
    ONE_TIME = "one_time",
    SUBSCRIPTION = "subscription",
    RECURRING = "recurring",
}

export enum RecurringTokenPrivilege {
    NONE = "none",
    BOUNDED = "bounded",
    INFINITE = "infinite",
}

/* Request */

export interface TransactionTokenCardData {
    cardholder: string;
    cardNumber: string;
    expMonth: number | string;
    expYear: number | string;
    cvv: string;
    line1?: string;
    line2?: string;
    state?: string;
    city?: string;
    country?: string;
    zip?: string;
    phoneNumber?: PhoneNumber;
}

export interface TransactionTokenQRScanData {
    scannedQR: string;
}

export interface TransactionTokenConvenienceData {
    customerName: string;
    convenienceStore: ConvenienceStore;
    phoneNumber: PhoneNumber;
}

export interface TransactionTokenPaidyData {
    paidyToken: string;
    phoneNumber: PhoneNumber;
}

export interface TransactionTokenCreateParams {
    paymentType: PaymentType;
    type: TransactionTokenType;
    email?: string;
    usageLimit?: UsageLimit;
    data:
        | TransactionTokenCardData
        | TransactionTokenQRScanData
        | TransactionTokenConvenienceData
        | TransactionTokenPaidyData;
    metadata?: Metadata;
    useConfirmation?: boolean;
}

export interface TransactionTokenListParams extends CRUDPaginationParams {
    customerId?: string;
    type?: TransactionTokenType;
    search?: string;
    mode?: ProcessingMode;
}

export interface TransactionTokenUpdateParams {
    email?: string;
}

export interface TransactionTokenConfirmParams {
    confirmationCode: string;
}

/* Response */

export interface TransactionTokenCardDetails {
    cardholder: string;
    expMonth: number;
    expYear: number;
    lastFour: string;
    brand: CardBrand;
    cardType?: CardType;
    country?: string;
    subBrand?: CardSubBrand;
    issuer?: string;
    category?: CardCategory;
}

export interface TransactionTokenCardBilling {
    line1?: string;
    line2?: string;
    state?: string;
    city?: string;
    country?: string;
    zip?: string;
    phoneNumber?: PhoneNumber;
}

export interface TransactionTokenCardDataItem {
    card?: TransactionTokenCardDetails;
    billing?: TransactionTokenCardBilling;
}

export interface TransactionTokenQRScanDataItem {
    brand: QRBrand;
    gateway?: QRGateway;
}

export interface TransactionTokenConvenienceDataItem {
    convenienceStore?: ConvenienceStore;
    customerName?: string;
    expirationPeriod?: string;
    phoneNumber?: PhoneNumber;
}

export interface TransactionTokenItem {
    id: string;
    storeId: string;
    email: string;
    mode: ProcessingMode;
    createdOn: string;
    lastUsedOn: string;
    type: TransactionTokenType;
    paymentType: PaymentType;
    usageLimit?: UsageLimit;
    data?:
        | TransactionTokenCardDataItem
        | TransactionTokenQRScanDataItem
        | TransactionTokenConvenienceDataItem
        | TransactionTokenPaidyData;
    metadata?: Metadata;
}

export type ResponseTransactionToken = TransactionTokenItem;
export type ResponseTransactionTokens = CRUDItemsResponse<TransactionTokenItem>;

export class TransactionTokens extends CRUDResource {
    static requiredParams: string[] = ["paymentType", "type", "data"];

    static routeBase = "/stores/:storeId/tokens";

    create(
        data: SendData<TransactionTokenCreateParams>,
        callback?: ResponseCallback<ResponseTransactionToken>
    ): Promise<ResponseTransactionToken> {
        return this.defineRoute(HTTPMethod.POST, "/tokens", TransactionTokens.requiredParams)(data, callback);
    }

    get(
        storeId: string,
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ResponseTransactionToken>
    ): Promise<ResponseTransactionToken> {
        return this._getRoute()(data, callback, ["storeId", "id"], storeId, id);
    }

    list(
        data?: SendData<TransactionTokenListParams>,
        callback?: ResponseCallback<ResponseTransactionTokens>,
        storeId?: string
    ): Promise<ResponseTransactionTokens> {
        return this.defineRoute(HTTPMethod.GET, "(/stores/:storeId)/tokens")(data, callback, ["storeId"], storeId);
    }

    update(
        storeId: string,
        id: string,
        data?: SendData<TransactionTokenUpdateParams>,
        callback?: ResponseCallback<ResponseTransactionToken>
    ): Promise<ResponseTransactionToken> {
        return this._updateRoute()(data, callback, ["storeId", "id"], storeId, id);
    }

    delete(
        storeId: string,
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ErrorResponse>
    ): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, ["storeId", "id"], storeId, id);
    }

    confirm(
        storeId: string,
        id: string,
        data: SendData<TransactionTokenConfirmParams>,
        callback?: ResponseCallback<ErrorResponse>
    ): Promise<ErrorResponse> {
        return this.defineRoute(HTTPMethod.POST, "/stores/:storeId/tokens/:id/confirm")(
            data,
            callback,
            ["storeId", "id"],
            storeId,
            id
        );
    }
}
