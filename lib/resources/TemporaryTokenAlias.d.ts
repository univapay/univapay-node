/**
 *  @module Resources/TemporaryTokenAlias
 */
import { CRUDResource } from './CRUDResource';
import { ErrorResponse, ResponseCallback, SendData } from '../api/RestAPI';
import { PaymentType, TransactionTokenType } from './TransactionTokens';
import { ProcessingMode } from './common/enums';
import { Metadata } from './common/types';
export interface TemporaryTokenAliasItem {
    id?: string;
    platformId?: string;
    merchantId?: string;
    storeId?: string;
    email?: string;
    paymentType?: PaymentType;
    active?: boolean;
    mode?: ProcessingMode;
    type?: TransactionTokenType;
    createdOn?: string;
    lastUsedOn?: string;
    amount?: number;
    currency?: string;
    aliasMetadata?: Metadata;
}
export interface TemporaryTokenAliasShortItem {
    key?: string;
    validUntil?: string;
}
export interface TemporaryTokenAliasCreateParams {
    transactionTokenId: string;
    metadata?: any;
    amount?: number;
    currency?: string;
    validUntil?: string;
}
export declare enum TemporaryTokenAliasQrLogoType {
    None = "None",
    Centered = "Centered",
    Background = "Background"
}
export declare enum TemporaryTokenAliasMedia {
    Json = "json",
    QR = "qr"
}
export interface TemporaryTokenAliasParams {
    media?: TemporaryTokenAliasMedia;
}
export interface TemporaryTokenAliasQrOptions {
    media: TemporaryTokenAliasMedia.QR;
    size?: number;
    logo?: TemporaryTokenAliasQrLogoType;
    color?: string;
}
export declare type ResponseTemporaryTokenAlias = TemporaryTokenAliasItem;
export declare type MethodGet<P, R> = (storeId: string, id: string, data?: SendData<P>, callback?: ResponseCallback<R>) => Promise<R>;
export declare class TemporaryTokenAlias extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    create(data: SendData<TemporaryTokenAliasCreateParams>, callback?: ResponseCallback<ResponseTemporaryTokenAlias>): Promise<ResponseTemporaryTokenAlias>;
    get(storeId: string, id: string, data?: SendData<TemporaryTokenAliasQrOptions>, callback?: ResponseCallback<Blob>): Promise<Blob>;
    get(storeId: string, id: string, data?: SendData<TemporaryTokenAliasParams>, callback?: ResponseCallback<ResponseTemporaryTokenAlias>): Promise<ResponseTemporaryTokenAlias>;
    delete(storeId: string, id: string, data?: SendData<void>, callback?: ResponseCallback<ErrorResponse>): Promise<ErrorResponse>;
}
