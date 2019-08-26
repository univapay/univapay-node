"use strict";
/**
 *  @module SDK
 */
Object.defineProperty(exports, "__esModule", { value: true });
var RestAPI_1 = require("../api/RestAPI");
var PaymentsSDK = /** @class */ (function () {
    function PaymentsSDK(options) {
        this.api = new RestAPI_1.RestAPI(options);
    }
    return PaymentsSDK;
}());
exports.PaymentsSDK = PaymentsSDK;
//# sourceMappingURL=PaymentsSDK.js.map