/**
 *  @module SDK
 */
import { RestAPI, RestAPIOptions } from '../api/RestAPI';
export declare abstract class PaymentsSDK {
    api: RestAPI;
    constructor(options?: RestAPIOptions);
}
