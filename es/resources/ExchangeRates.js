import * as tslib_1 from "tslib";
/* Request */
import { Resource } from './Resource';
import { HTTPMethod } from '../api/RestAPI';
var ExchangeRates = /** @class */ (function (_super) {
    tslib_1.__extends(ExchangeRates, _super);
    function ExchangeRates() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExchangeRates.prototype.calculate = function (data, callback) {
        return this.defineRoute(HTTPMethod.POST, '/exchange_rates/calculate')(data, callback);
    };
    return ExchangeRates;
}(Resource));
export { ExchangeRates };
//# sourceMappingURL=ExchangeRates.js.map