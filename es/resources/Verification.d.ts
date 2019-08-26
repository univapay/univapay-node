/**
 *  @module Resources/Verification
 */
import { ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
import { ContactInfo, ContactInfoPartial } from './common/ContactInfo';
import { PhoneNumber } from './common/types';
import { RecurringTokenPrivilege } from './TransactionTokens';
export interface BaseVerification<T> {
    homepageUrl: string;
    companyDescription: string;
    companyContactInfo: T;
    businessType: string;
    systemManagerName: string;
    systemManagerNumber?: PhoneNumber;
    systemManagerEmail?: string;
    recurringTokenRequest?: RecurringTokenPrivilege;
    recurringTokenRequestReason?: string;
    allowEmptyCvv?: boolean;
}
export declare type VerificationCreateParams = BaseVerification<ContactInfo>;
export declare type VerificationUpdateParams = Partial<BaseVerification<ContactInfoPartial>>;
export interface VerificationItem extends BaseVerification<ContactInfo> {
    id: string;
    createdOn: string;
}
export declare type ResponseVerification = VerificationItem;
export declare class Verification extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    create(data: SendData<VerificationCreateParams>, callback?: ResponseCallback<ResponseVerification>): Promise<ResponseVerification>;
    get(data?: SendData<void>, callback?: ResponseCallback<ResponseVerification>): Promise<ResponseVerification>;
    update(data?: SendData<VerificationUpdateParams>, callback?: ResponseCallback<ResponseVerification>): Promise<ResponseVerification>;
}
