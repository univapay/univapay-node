/**
 *  @module Resources/TemporaryTokenAlias
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { ProcessingMode } from "./common/enums.js";
import { Metadata } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { PaymentType, TransactionTokenType } from "./TransactionTokens.js";

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

export type MethodGet<P, R> = (storeId: string, id: string, data?: SendData<P>) => Promise<R>;

export class TemporaryTokenAlias extends CRUDResource {
    static requiredParams: string[] = ["transactionTokenId"];

    static routeBase = "/stores/:storeId/tokens/alias";

    create(data: SendData<TemporaryTokenAliasCreateParams>, auth?: AuthParams): Promise<ResponseTemporaryTokenAlias> {
        return this.defineRoute(HTTPMethod.POST, "/tokens/alias", {
            requiredParams: TemporaryTokenAlias.requiredParams,
        })(data, auth);
    }

    get(storeId: string, id: string, data?: SendData<TemporaryTokenAliasQrOptions>, auth?: AuthParams): Promise<Blob>;

    get(
        storeId: string,
        id: string,
        data?: SendData<TemporaryTokenAliasParams>,
        auth?: AuthParams
    ): Promise<ResponseTemporaryTokenAlias>;

    get(storeId: string, id: string, data?: SendData<TemporaryTokenAliasParams>, auth?: AuthParams): Promise<any> {
        return this.defineRoute(HTTPMethod.GET, `${this._routeBase}/:id`, {
            acceptType: data?.media === TemporaryTokenAliasMedia.QR ? "image/png" : undefined,
        })(data, auth, { storeId, id });
    }

    delete(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        return this._deleteRoute()(data, auth, { storeId, id });
    }
}
