/**
 *  @module SDK
 */

import { EventEmitter } from "events";

import { RestAPI, RestAPIOptions } from "../api/RestAPI";

export abstract class PaymentsSDK extends EventEmitter {
    api: RestAPI;

    constructor(options?: RestAPIOptions) {
        super();

        this.api = new RestAPI(options);
        this.on("newListener", (event, listener) => this.api.on(event, listener));
        this.on("removeListener", (event, listener) => this.api.removeListener(event, listener));
    }
}
