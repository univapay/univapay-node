/**
 *  @module Resources/TemporaryTokenAlias
 */

import { ErrorResponse, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI";

import { ProcessingMode } from "./common/enums";
import { Metadata } from "./common/types";
import { CRUDResource } from "./CRUDResource";
import { PaymentType, TransactionTokenType } from "./TransactionTokens";

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

export enum TemporaryTokenAliasQrLogoType {
    None = "None",
    Centered = "Centered",
    Background = "Background",
}

export enum TemporaryTokenAliasMedia {
    Json = "json",
    QR = "qr",
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

export type ResponseTemporaryTokenAlias = TemporaryTokenAliasItem;

export type MethodGet<P, R> = (
    storeId: string,
    id: string,
    data?: SendData<P>,
    callback?: ResponseCallback<R>
) => Promise<R>;

export class TemporaryTokenAlias extends CRUDResource {
    static requiredParams: string[] = ["transactionTokenId"];

    static routeBase = "/stores/:storeId/tokens/alias";

    create(
        data: SendData<TemporaryTokenAliasCreateParams>,
        callback?: ResponseCallback<ResponseTemporaryTokenAlias>
    ): Promise<ResponseTemporaryTokenAlias> {
        return this.defineRoute(HTTPMethod.POST, "/tokens/alias", TemporaryTokenAlias.requiredParams)(data, callback);
    }

    get(
        storeId: string,
        id: string,
        data?: SendData<TemporaryTokenAliasQrOptions>,
        callback?: ResponseCallback<Blob>
    ): Promise<Blob>;
    get(
        storeId: string,
        id: string,
        data?: SendData<TemporaryTokenAliasParams>,
        callback?: ResponseCallback<ResponseTemporaryTokenAlias>
    ): Promise<ResponseTemporaryTokenAlias>;

    get(
        storeId: string,
        id: string,
        data?: SendData<TemporaryTokenAliasParams>,
        callback?: ResponseCallback<any>
    ): Promise<any> {
        return this.defineRoute(
            HTTPMethod.GET,
            `${this._routeBase}/:id`,
            undefined,
            undefined,
            data && data.media === TemporaryTokenAliasMedia.QR ? "image/png" : undefined
        )(data, callback, ["storeId", "id"], storeId, id);
    }

    delete(
        storeId: string,
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ErrorResponse>
    ): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, ["storeId", "id"], storeId, id);
    }
}
