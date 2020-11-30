/**
 *  @module Resources/ECForms
 */
import { AuthParams, ResponseCallback, SendData } from "../api/RestAPI";

import { CRUDResource } from "./CRUDResource";

type BaseMetadata = Record<string, string>;

export enum CheckoutType {
    PAYMENT = "payment",
    TOKEN = "token",
}

export enum ECFormCustomFieldType {
    STRING = "string",
    SELECT = "select",
}

export type ECFormCustomField = {
    key: string;
    label: string;
    type: ECFormCustomFieldType;
    required?: boolean;
    options?: string[];
};

export type ECFormItem<Metadata = BaseMetadata> = {
    /* EC Form data */
    id: string;
    storeId: string;
    name: string;
    createdOn: string;

    /* Redirects */
    successRedirectUrl?: string;
    failureRedirectUrl?: string;

    /* Charge and token data */
    appId: string;

    /* Display */
    locale: string | null;
    dark: boolean;
    displayStoreName: boolean;
    displayStoreLogo: boolean;
    headerColor?: string;
    buttonColor?: string;
    backgroundColor?: string;

    /* Address */
    address?: boolean | null;
    requireName?: boolean | null;
    requireEmail?: boolean | null;
    requireBillingAddress?: boolean | null;
    requirePhoneNumber?: boolean | null;

    /* Metadata */
    metadata: Metadata | null;
    customFieldsTitles?: Record<string, string>; // keyed by language
    customFields?: Record<string, ECFormCustomField[]>; // keyed by language
};

export type ResponseECForm<Metadata = BaseMetadata> = ECFormItem<Metadata>;

export class ECForms extends CRUDResource {
    static requiredParams: string[] = [];
    static routeBase = "/forms";

    get(
        id: string,
        data?: SendData<void>,
        auth?: AuthParams,
        callback?: ResponseCallback<ECFormItem>
    ): Promise<ResponseECForm> {
        return this._getRoute()(data, callback, auth, { id });
    }
}
