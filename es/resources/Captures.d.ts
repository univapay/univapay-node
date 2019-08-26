/**
 *  @module Resources/Captures
 */
import { ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
export declare enum CaptureStatus {
    Authorized = "authorized",
    Captured = "captured",
    NotAuthorized = "not_authorized"
}
export interface CaptureCreateParams {
    amount: number;
    currency: string;
}
export declare class Captures extends CRUDResource {
    static requiredParams: string[];
    static routeBase: string;
    create(storeId: string, chargeId: string, data: SendData<CaptureCreateParams>, callback?: ResponseCallback<any>): Promise<any>;
}
