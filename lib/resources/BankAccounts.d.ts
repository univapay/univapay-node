/**
 *  @module Resources/BankAccounts
 */
import { ResponseCallback, ErrorResponse, SendData } from '../api/RestAPI';
import { CRUDResource, CRUDPaginationParams, CRUDItemsResponse } from './CRUDResource';
export declare enum BankAccountStatus {
    NEW = "new",
    UNABLE_TO_VERIFY = "unable_to_verify",
    VERIFIED = "verified",
    ERRORED = "errored"
}
export declare enum BankAccountType {
    CHECKING = "checking",
    SAVINGS = "savings"
}
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
export declare type BankAccountUpdateParams = Partial<BankAccountCreateParams>;
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
export declare type ResponseBankAccount = BankAccountItem;
export declare type ResponseBankAccounts = CRUDItemsResponse<BankAccountItem>;
export declare class BankAccounts extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    list(data?: SendData<BankAccountsListParams>, callback?: ResponseCallback<ResponseBankAccounts>): Promise<ResponseBankAccounts>;
    create(data: SendData<BankAccountCreateParams>, callback?: ResponseCallback<ResponseBankAccount>): Promise<ResponseBankAccount>;
    get(id: string, data?: SendData<void>, callback?: ResponseCallback<ResponseBankAccount>): Promise<ResponseBankAccount>;
    update(id: string, data?: SendData<BankAccountUpdateParams>, callback?: ResponseCallback<ResponseBankAccount>): Promise<ResponseBankAccount>;
    delete(id: string, data?: SendData<void>, callback?: ResponseCallback<ErrorResponse>): Promise<ErrorResponse>;
    getPrimary(data?: SendData<void>, callback?: ResponseCallback<ResponseBankAccount>): Promise<ResponseBankAccount>;
}
