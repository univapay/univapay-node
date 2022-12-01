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
import { DefinedRoute } from "./Resource.js";

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
    HTTP_GET_MOBILE = "http_get_mobile",
    HTTP_POST = "http_post",
    SDK = "sdk",
    WEB = "web",
    APP = "app",
}

export enum OSType {
    IOS = "ios",
    ANDROID = "android",
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
    cvvAuthorize?: {
        enabled: boolean;
        status: CvvAuthorizedStatus;
        chargeId?: string;
        credentialsId?: string;
        currency?: string;
    };
}

export interface TransactionTokenQRScanData {
    scannedQR: string;
}

export interface TransactionTokenConvenienceData {
    customerName: string;
    convenienceStore: ConvenienceStore;
    phoneNumber: PhoneNumber;

    /**
     * Time with Time Zone.
     * HH:mm:ss.SSSZ  (e.g: 09:00:00.000+09:00)
     */
    expirationTimeShift?: string;

    /**
     * Interval (e.g P7D)
     */
    expirationPeriod?: string;
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

    /**
     * Time with Time Zone.
     * HH:mm:ss.SSSZ  (e.g: 09:00:00.000+09:00)
     */
    expirationTimeShift?: string;

    /**
     * Interval (e.g P7D)
     */
    expirationPeriod?: string;
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
    data?: {
        cvv?: string;
        cvvAuthorize?: {
            enabled: boolean;
        };
        cardholder?: string;
        line1?: string;
        line2?: string;
        state?: string;
        city?: string;
        country?: string;
        zip?: string;
        phoneNumber: {
            countryCode?: string;
            localNumber?: string;
        };
    };
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

    private _get?: DefinedRoute;
    get(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseTransactionToken> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { storeId, id });
    }

    private _list?: DefinedRoute;
    list(
        data?: SendData<TransactionTokenListParams>,
        auth?: AuthParams,
        storeId?: string
    ): Promise<ResponseTransactionTokens> {
        this._list = this._list ?? this.defineRoute(HTTPMethod.GET, "(/stores/:storeId)/tokens");
        return this._list(data, auth, { storeId });
    }

    private _update?: DefinedRoute;
    update(
        storeId: string,
        id: string,
        data?: SendData<TransactionTokenUpdateParams>,
        auth?: AuthParams
    ): Promise<ResponseTransactionToken> {
        this._update = this._update ?? this._updateRoute();
        return this._update(data, auth, { storeId, id });
    }

    private _delete?: DefinedRoute;
    delete(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        this._delete = this._delete ?? this._deleteRoute();
        return this._delete(data, auth, { storeId, id });
    }

    private _confirm?: DefinedRoute;
    confirm(
        storeId: string,
        id: string,
        data: SendData<TransactionTokenConfirmParams>,
        auth?: AuthParams
    ): Promise<void> {
        this._confirm = this._confirm ?? this.defineRoute(HTTPMethod.POST, "/stores/:storeId/tokens/:id/confirm");
        return this._confirm(data, auth, { storeId, id });
    }
}
