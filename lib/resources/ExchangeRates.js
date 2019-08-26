"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/* Request */
var Resource_1 = require("./Resource");
var RestAPI_1 = require("../api/RestAPI");
var ExchangeRates = /** @class */ (function (_super) {
    tslib_1.__extends(ExchangeRates, _super);
    function ExchangeRates() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExchangeRates.prototype.calculate = function (data, callback) {
        return this.defineRoute(RestAPI_1.HTTPMethod.POST, '/exchange_rates/calculate')(data, callback);
    };
    return ExchangeRates;
}(Resource_1.Resource));
exports.ExchangeRates = ExchangeRates;
//# sourceMappingURL=ExchangeRates.js.map