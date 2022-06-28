/**
 *  @module Resources/TemporaryTokenAlias
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { ProcessingMode } from "./common/enums.js";
import { Metadata } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
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

    private _create?: DefinedRoute;
    create(data: SendData<TemporaryTokenAliasCreateParams>, auth?: AuthParams): Promise<ResponseTemporaryTokenAlias> {
        this._create =
            this._create ??
            this.defineRoute(HTTPMethod.POST, "/tokens/alias", {
                requiredParams: TemporaryTokenAlias.requiredParams,
            });
        return this._create(data, auth);
    }

    private _get?: DefinedRoute;
    get(storeId: string, id: string, data?: SendData<TemporaryTokenAliasParams>, auth?: AuthParams): Promise<any> {
        this._get =
            this._get ??
            this.defineRoute(HTTPMethod.GET, `${this._routeBase}/:id`, {
                acceptType: data?.media === TemporaryTokenAliasMedia.QR ? "image/png" : undefined,
            });
        return this._get(data, auth, { storeId, id });
    }

    private _delete?: DefinedRoute;
    delete(storeId: string, id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        this._delete = this._delete ?? this._deleteRoute();
        return this._delete(data, auth, { storeId, id });
    }
}
