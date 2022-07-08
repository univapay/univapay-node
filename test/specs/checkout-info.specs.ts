import { expect } from "chai";
import fetchMock from "fetch-mock";

import { RestAPI } from "../../src/api/RestAPI.js";
import { CheckoutInfo } from "../../src/resources/CheckoutInfo.js";
import { OnlineBrand } from "../../src/resources/common/enums.js";
import { OnlineCallMethod, OSType } from "../../src/resources/TransactionTokens.js";
import { generateFixture as generateCheckoutInfo, generateGatewayFixture } from "../fixtures/checkout-info.js";
import { testEndpoint } from "../utils/index.js";

describe("Checkout Info", () => {
    let api: RestAPI;
    let checkoutInfo: CheckoutInfo;

    const recordData = generateCheckoutInfo();
    const gatewayRecordData = generateGatewayFixture();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        checkoutInfo = new CheckoutInfo(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("GET /checkout_info", () => {
        it("should get response", async () => {
            fetchMock.getOnce(`begin:${testEndpoint}/checkout_info`, {
                status: 200,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(checkoutInfo.get({ origin: "http://fake.com" })).to.eventually.eql(recordData);
        });
    });

    context("GET /checkout_info/gateway/:brand", () => {
        it("should get response", async () => {
            fetchMock.getOnce(`begin:${testEndpoint}/checkout_info/gateway/:brand`, {
                status: 200,
                body: gatewayRecordData,
                headers: { "Content-Type": "application/json" },
            });

            await expect(
                checkoutInfo.gateway(OnlineBrand.ALIPAY_PLUS_ONLINE, {
                    amount: 1000,
                    currency: "jpy",
                    callMethod: OnlineCallMethod.APP,
                    osType: OSType.IOS,
                })
            ).to.eventually.eql(gatewayRecordData);
        });
    });
});
