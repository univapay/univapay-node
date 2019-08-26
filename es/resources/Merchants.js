/**
 *  @module Resources/Merchants
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
var Merchants = /** @class */ (function (_super) {
    tslib_1.__extends(Merchants, _super);
    function Merchants() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Merchants.prototype.me = function (data, callback) {
        return this.defineRoute(HTTPMethod.GET, '/me')(data, callback);
    };
    return Merchants;
}(CRUDResource));
export { Merchants };
//# sourceMappingURL=Merchants.js.map