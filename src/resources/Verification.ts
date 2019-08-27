/**
 *  @module Resources/Verification
 */

import { ResponseCallback, HTTPMethod, SendData } from '../api/RestAPI';
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

/* Request */
export type VerificationCreateParams = BaseVerification<ContactInfo>;
export type VerificationUpdateParams = Partial<BaseVerification<ContactInfoPartial>>;

/* Response */
export interface VerificationItem extends BaseVerification<ContactInfo> {
    id: string;
    createdOn: string;
}

export type ResponseVerification = VerificationItem;

export class Verification extends CRUDResource {
    static requiredParams: string[] = [
        'homepageUrl',
        'companyDescription',
        'companyContactInfo',
        'businessType',
        'systemManagerName',
    ];

    static routeBase = '/verification';

    create(
        data: SendData<VerificationCreateParams>,
        callback?: ResponseCallback<ResponseVerification>,
    ): Promise<ResponseVerification> {
        return this._createRoute(Verification.requiredParams)(data, callback);
    }

    get(data?: SendData<void>, callback?: ResponseCallback<ResponseVerification>): Promise<ResponseVerification> {
        return this.defineRoute(HTTPMethod.GET, this._routeBase)(data, callback);
    }

    update(
        data?: SendData<VerificationUpdateParams>,
        callback?: ResponseCallback<ResponseVerification>,
    ): Promise<ResponseVerification> {
        return this.defineRoute(HTTPMethod.PATCH, this._routeBase)(data, callback);
    }
}
