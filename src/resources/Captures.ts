/**
 *  @module Resources/Captures
 */

import { ResponseCallback, SendData } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';

/* Request */
export enum CaptureStatus {
    Authorized = 'authorized',
    Captured = 'captured',
    NotAuthorized = 'not_authorized',
}

export interface CaptureCreateParams {
    amount: number;
    currency: string;
}

/* Response */

export class Captures extends CRUDResource {
    static requiredParams: string[] = ['amount', 'currency'];

    static routeBase: string = '/stores/:storeId/charges/:chargeId/capture';

    create(
        storeId: string,
        chargeId: string,
        data: SendData<CaptureCreateParams>,
        callback?: ResponseCallback<any>,
    ): Promise<any> {
        return this._createRoute(Captures.requiredParams)(data, callback, ['storeId', 'chargeId'], storeId, chargeId);
    }
}
