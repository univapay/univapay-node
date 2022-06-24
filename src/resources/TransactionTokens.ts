/**
 *  @module Resources/TransactionTokens
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import {
    BankTransferBrand,
    CardBrand,
    CardCategory,
    CardSubBrand,
    CardType,
    OnlineBrand,
    OnlineGateway,
    ProcessingMode,
    QRBrand,
    QRGateway,
} from "./common/enums.js";
import { Metadata, PhoneNumber, WithStoreMerchantName } from "./common/types.js";
import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";

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
    ONLINE = "online",
    BANK_TRANSFER = "bank_transfer",
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

export enum CvvAuthorizedStatus {
    PENDING = "pending",
    FAILED = "failed",
    CURRENT = "current",
    INACTIVE = "inactive",
}

export enum OnlineCallMethod {
    HTTP_GET = "http_get",
    HTTP_POST = "http_post",
    SDK = "sdk",
    WEB = "web",
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

export interface TransactionTokenOnlineData {
    brand: OnlineBrand;
    callMethod?: OnlineCallMethod; // defaults to OnlineCallMethod.HTTP_POST

    /** @deprecated Use `brand` instead */
    gateway?: OnlineGateway;
}

export interface TransactionTokenPaidyData {
    paidyToken: string;
    phoneNumber?: PhoneNumber;
    shippingAddress: TransactionTokenPaidyBilling;
}
export type TransactionTokenBankTransferData = {
    accountHolderName: string | null;
    accountId: string | null;
    accountNumber: string | null;
    bankCode: string;
    bankName: string;
    branchCode: string | null;
    branchName: string | null;
    brand: BankTransferBrand;
};

export type TransactionTokenBankTransferCreateData = {
    brand: BankTransferBrand;
};

export interface TransactionTokenCreateParams<T extends Metadata = Metadata> {
    paymentType: PaymentType;
    type: TransactionTokenType;
    email?: string;
    usageLimit?: UsageLimit;
    data:
        | TransactionTokenCardData
        | TransactionTokenQRScanData
        | TransactionTokenConvenienceData
        | TransactionTokenOnlineData
        | TransactionTokenPaidyData
        | TransactionTokenBankTransferCreateData;
    metadata?: T;
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
    data?: { cvv?: string };
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

export interface TransactionTokenPaidyBilling {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    zip: string;
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

export interface TransactionTokenBase {
    cvvAuthorize?: {
        enabled: boolean;
        status: CvvAuthorizedStatus;
        chargeId?: string;
        credentialsId: string;
        currency?: string;
    };
}

export interface TransactionTokenCardDataItem extends TransactionTokenBase {
    card?: TransactionTokenCardDetails;
    billing?: TransactionTokenCardBilling;
}
export interface TransactionTokenQRScanDataItem extends TransactionTokenBase {
    brand: QRBrand;
    gateway?: QRGateway;
}

export interface TransactionTokenOnlineDataItem extends TransactionTokenBase {
    brand: OnlineBrand;

    /** @deprecated Use `brand` instead */
    gateway?: OnlineGateway;
}

export interface TransactionTokenConvenienceDataItem extends TransactionTokenBase {
    convenienceStore?: ConvenienceStore;
    customerName?: string;
    expirationPeriod?: string;
    phoneNumber?: PhoneNumber;
}
export interface TransactionTokenItem<T extends Metadata = Metadata> {
    id: string;
    storeId: string;
    email: string;
    mode: ProcessingMode;
    createdOn: string;
    lastUsedOn: string;
    type: TransactionTokenType;
    paymentType: PaymentType;
    usageLimit?: UsageLimit;
    confirmed?: boolean;
    data?: (
        | TransactionTokenCardDataItem
        | TransactionTokenQRScanDataItem
        | TransactionTokenConvenienceDataItem
        | TransactionTokenOnlineDataItem
        | TransactionTokenPaidyData
        | TransactionTokenBankTransferData
    ) & { cvvAuthorize?: { status: CvvAuthorizedStatus } };
    metadata?: T;
}

export type TransactionTokenListItem = WithStoreMerchantName<TransactionTokenItem>;

export type ResponseTransactionToken = TransactionTokenItem;
export type ResponseTransactionTokens = CRUDItemsResponse<TransactionTokenListItem>;

export class TransactionTokens extends CRUDResource {
    static requiredParams: string[] = ["paymentType", "type", "data"];

    static routeBase = "/stores/:storeId/tokens";

    create(data: SendData<TransactionTokenCreateParams>, auth?: AuthParams): Promise<ResponseTransactionToken> {
        return this.defineRoute(HTTPMethod.POST, "/tokens", { requiredParams: TransactionTokens.requiredParams })(
            data,
            auth
        );
    }

    get(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseTransactionToken> {
        return this._getRoute()(data, auth, { storeId, id });
    }

    list(
        data?: SendData<TransactionTokenListParams>,
        auth?: AuthParams,
        storeId?: string
    ): Promise<ResponseTransactionTokens> {
        return this.defineRoute(HTTPMethod.GET, "(/stores/:storeId)/tokens")(data, auth, { storeId });
    }

    update(
        storeId: string,
        id: string,
        data?: SendData<TransactionTokenUpdateParams>,
        auth?: AuthParams
    ): Promise<ResponseTransactionToken> {
        return this._updateRoute()(data, auth, { storeId, id });
    }

    delete(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        return this._deleteRoute()(data, auth, { storeId, id });
    }

    confirm(
        storeId: string,
        id: string,
        data: SendData<TransactionTokenConfirmParams>,
        auth?: AuthParams
    ): Promise<void> {
        return this.defineRoute(HTTPMethod.POST, "/stores/:storeId/tokens/:id/confirm")(data, auth, {
            storeId,
            id,
        });
    }
}
