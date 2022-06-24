/**
 *  @module Resources/BankAccounts
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

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

    list(data?: SendData<BankAccountsListParams>, auth?: AuthParams): Promise<ResponseBankAccounts> {
        return this._listRoute()(data, auth);
    }

    create(data: SendData<BankAccountCreateParams>, auth?: AuthParams): Promise<ResponseBankAccount> {
        return this._createRoute({ requiredParams: BankAccounts.requiredParams })(data, auth);
    }

    get(id: string, data?: SendData<void>, auth?: AuthParams): Promise<ResponseBankAccount> {
        return this._getRoute()(data, auth, { id });
    }

    update(id: string, data?: SendData<BankAccountUpdateParams>, auth?: AuthParams): Promise<ResponseBankAccount> {
        return this._updateRoute()(data, auth, { id });
    }

    delete(id: string, data?: SendData<void>, auth?: AuthParams): Promise<void> {
        return this._deleteRoute()(data, auth, { id });
    }

    getPrimary(data?: SendData<void>, auth?: AuthParams): Promise<ResponseBankAccount> {
        return this.defineRoute(HTTPMethod.GET, `${this._routeBase}/primary`)(data, auth);
    }
}
