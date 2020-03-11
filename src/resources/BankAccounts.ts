/**
 *  @module Resources/BankAccounts
 */

import { ResponseCallback, ErrorResponse, HTTPMethod, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';

export enum BankAccountStatus {
    NEW = 'new',
    UNABLE_TO_VERIFY = 'unable_to_verify',
    VERIFIED = 'verified',
    ERRORED = 'errored',
}

export enum BankAccountType {
    CHECKING = 'checking',
    SAVINGS = 'savings',
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
}
export type BankAccountUpdateParams = Partial<BankAccountCreateParams> & {
    primary?: boolean;
};

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

export type ResponseBankAccount = BankAccountItem;
export type ResponseBankAccounts = CRUDItemsResponse<BankAccountItem>;

export class BankAccounts extends CRUDResource {
    static requiredParams: string[] = ['accountNumber', 'country', 'currency', 'holderName', 'bankName'];

    static routeBase = '/bank_accounts';

    list(
        data?: SendData<BankAccountsListParams>,
        callback?: ResponseCallback<ResponseBankAccounts>,
    ): Promise<ResponseBankAccounts> {
        return this._listRoute()(data, callback);
    }

    create(
        data: SendData<BankAccountCreateParams>,
        callback?: ResponseCallback<ResponseBankAccount>,
    ): Promise<ResponseBankAccount> {
        return this._createRoute(BankAccounts.requiredParams)(data, callback);
    }

    get(
        id: string,
        data?: SendData<void>,
        callback?: ResponseCallback<ResponseBankAccount>,
    ): Promise<ResponseBankAccount> {
        return this._getRoute()(data, callback, ['id'], id);
    }

    update(
        id: string,
        data?: SendData<BankAccountUpdateParams>,
        callback?: ResponseCallback<ResponseBankAccount>,
    ): Promise<ResponseBankAccount> {
        return this._updateRoute()(data, callback, ['id'], id);
    }

    delete(id: string, data?: SendData<void>, callback?: ResponseCallback<ErrorResponse>): Promise<ErrorResponse> {
        return this._deleteRoute()(data, callback, ['id'], id);
    }

    getPrimary(data?: SendData<void>, callback?: ResponseCallback<ResponseBankAccount>): Promise<ResponseBankAccount> {
        return this.defineRoute(HTTPMethod.GET, `${this._routeBase}/primary`)(data, callback);
    }
}
