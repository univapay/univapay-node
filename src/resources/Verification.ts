/**
 *  @module Resources/Verification
 */

import { AuthParams, HTTPMethod, SendData } from "../api/RestAPI.js";

import { ContactInfo, ContactInfoPartial } from "./common/ContactInfo.js";
import { PhoneNumber } from "./common/types.js";
import { CRUDResource } from "./CRUDResource.js";
import { DefinedRoute } from "./Resource.js";
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

    private _create: DefinedRoute;
    create(data: SendData<VerificationCreateParams>, auth?: AuthParams): Promise<ResponseVerification> {
        this._create = this._create ?? this._createRoute({ requiredParams: Verification.requiredParams });
        return this._create(data, auth);
    }

    private _get: DefinedRoute;
    get(data?: SendData<void>, auth?: AuthParams): Promise<ResponseVerification> {
        this._get = this._get ?? this.defineRoute(HTTPMethod.GET, this._routeBase);
        return this._get(data, auth);
    }

    private _update: DefinedRoute;
    update(data?: SendData<VerificationUpdateParams>, auth?: AuthParams): Promise<ResponseVerification> {
        this._update = this._update ?? this.defineRoute(HTTPMethod.PATCH, this._routeBase);
        return this._update(data, auth);
    }
}
