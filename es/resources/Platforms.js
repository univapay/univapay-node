/**
 *  @module Resources/Platforms
 */
import * as tslib_1 from "tslib";
import { HTTPMethod } from '../api/RestAPI';
import { CRUDResource } from './CRUDResource';
var Platforms = /** @class */ (function (_super) {
    tslib_1.__extends(Platforms, _super);
    function Platforms() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Platforms.prototype.getConfiguration = function (data, callback) {
        return this.defineRoute(HTTPMethod.GET, '/platform', undefined, false)(data, callback);
    };
    return Platforms;
}(CRUDResource));
export { Platforms };
//# sourceMappingURL=Platforms.js.map