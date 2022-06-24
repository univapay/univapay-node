/**
 *  @module Resources/Verification
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { ContactInfo, ContactInfoPartial } from "./common/ContactInfo.js";
import { PhoneNumber } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { RecurringTokenPrivilege } from "./TransactionTokens.js";

export interface BaseVerification<T> {
    homepageUrl: string;
    companyDescription: string;
    companyContactInfo: T;
    businessType: string;
    systemManagerName: string;
    systemManagerNumber?: PhoneNumber;
    systemManagerEmail?: string;
    customerContactEmail?: string;
    customerContactNumber?: PhoneNumber;
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
        "homepageUrl",
        "companyDescription",
        "companyContactInfo",
        "businessType",
        "systemManagerName",
    ];

    static routeBase = "/verification";

    create(data: SendData<VerificationCreateParams>, auth?: AuthParams): Promise<ResponseVerification> {
        return this._createRoute({ requiredParams: Verification.requiredParams })(data, auth);
    }

    get(data?: SendData<void>, auth?: AuthParams): Promise<ResponseVerification> {
        return this.defineRoute(HTTPMethod.GET, this._routeBase)(data, auth);
    }

    update(data?: SendData<VerificationUpdateParams>, auth?: AuthParams): Promise<ResponseVerification> {
        return this.defineRoute(HTTPMethod.PATCH, this._routeBase)(data, auth);
    }
}
