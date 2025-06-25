/**
 *  @module Resources/BankAccounts
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";

export enum BankAccountStatus {
    NEW = "new",
    UNABLE_TO_VERIFY = "unable_to_verify",
    VERIFIED = "verified",
    ERRORED = "errored",
}

export enum BankAccountType {
    CHECKING = "checking",
    SAVINGS = "savings",
}

/* Request */
export interface BankAccountsListParams extends CRUDPaginationParams {
    primary?: boolean;
}

export interface BankAccountCreateParams {
    accountNumber: string;
    country: string;
    currency: string;
    holderName: string;
    bankName: string;
    branchName?: string;
    bankAddress?: string;
    routingNumber?: string;
    swiftCode?: string;
    ifscCode?: string;
    routingCode?: string;
    accountType: BankAccountType;
    primary?: boolean;
}
export type BankAccountUpdateParams = Partial<BankAccountCreateParams>;

/* Response */
export interface BankAccountItem {
    id: string;
    holderName: string;
    bankName: string;
    branchName?: string;
    country: string;
    bankAddress?: string;
    currency: string;
    routingNumber?: string;
    swiftCode?: string;
    ifscCode?: string;
    routingCode?: string;
    lastFour: string;
    status: BankAccountStatus;
    createdOn: string;
    primary: boolean;
    accountNumber: string;
    accountType: BankAccountType;
}

export type BankAccountListItem = BankAccountItem;

export type ResponseBankAccount = BankAccountItem;
export type ResponseBankAccounts = CRUDItemsResponse<BankAccountListItem>;

export class BankAccounts extends CRUDResource {
    static requiredParams: string[] = ["accountNumber", "country", "currency", "holderName", "bankName"];
    static routeBase = "/bank_accounts";

    private _list?: DefinedRoute;
    list(data?: SendData<BankAccountsListParams>, auth?: AuthParams): Promise<ResponseBankAccounts> {
        this._list = this._list ?? this._listRoute();
        return this._list(data, auth);
    }

    private _create?: DefinedRoute;
    create(data: SendData<BankAccountCreateParams>, auth?: AuthParams): Promise<ResponseBankAccount> {
        this._create = this._create ?? this._createRoute({ requiredParams: BankAccounts.requiredParams });
        return this._create(data, auth);
    }

    private _get?: DefinedRoute;
    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseBankAccount> {
        this._get = this._get ?? this._getRoute();
        return this._get(data, auth, { id });
    }

    private _update?: DefinedRoute;
    update(id: string, data?: SendData<BankAccountUpdateParams>, auth?: AuthParams): Promise<ResponseBankAccount> {
        this._update = this._update ?? this._updateRoute();
        return this._update(data, auth, { id });
    }

    private _delete?: DefinedRoute;
    delete(id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        this._delete = this._delete ?? this._deleteRoute();
        return this._delete(data, auth, { id });
    }

    private _getPrimary?: DefinedRoute;
    getPrimary(data?: SendData<void>, auth?: AuthParams): Promise<ResponseBankAccount> {
        this._getPrimary = this._getPrimary ?? this.defineRoute(HTTPMethod.GET, `${this._routeBase}/primary`);
        return this._getPrimary(data, auth);
    }
}
