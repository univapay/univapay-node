/**
 *  @module SDK
 */
import { RestAPI } from '../api/RestAPI';
var PaymentsSDK = /** @class */ (function () {
    function PaymentsSDK(options) {
        this.api = new RestAPI(options);
    }
    return PaymentsSDK;
}());
export { PaymentsSDK };
//# sourceMappingURL=PaymentsSDK.js.map