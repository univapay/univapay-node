/**
 *  @module Resources/BankAccounts
 */

import { AuthParams, HTTPMethod, ResponseCallback, SendData } from "../api/RestAPI.js";

import { CRUDItemsResponse, CRUDPaginationParams, CRUDResource } from "./CRUDResource.js";

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

    list(
        data?: SendData<BankAccountsListParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseBankAccounts>
    ): Promise<ResponseBankAccounts> {
        return this._listRoute()(data, callback, auth);
    }

    create(
        data: SendData<BankAccountCreateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseBankAccount>
    ): Promise<ResponseBankAccount> {
        return this._createRoute(BankAccounts.requiredParams)(data, callback, auth);
    }

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseBankAccount>
    ): Promise<ResponseBankAccount> {
        return this._getRoute()(data, callback, auth, { id });
    }

    update(
        id: string,
        data?: SendData<BankAccountUpdateParams>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseBankAccount>
    ): Promise<ResponseBankAccount> {
        return this._updateRoute()(data, callback, auth, { id });
    }

    delete(id: string, data?: SendData<void>, auth?: AuthParams, callback?: ResponseCallback<void>): Promise<void> {
        return this._deleteRoute()(data, callback, auth, { id });
    }

    getPrimary(
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ResponseBankAccount>
    ): Promise<ResponseBankAccount> {
        return this.defineRoute(HTTPMethod.GET, `${this._routeBase}/primary`)(data, callback, auth);
    }
}
