import { expect } from "chai";
import fetchMock from "fetch-mock";
import { Response } from "node-fetch";
import { parse } from "query-string";
import url from "url";

import { RestAPI } from "../../src/api/RestAPI";
import {
    TemporaryTokenAlias,
    TemporaryTokenAliasCreateParams,
    TemporaryTokenAliasItem,
    TemporaryTokenAliasMedia,
    TemporaryTokenAliasParams,
    TemporaryTokenAliasQrOptions,
} from "../../src/resources/TemporaryTokenAlias";
import { generateFixture as generateTemporaryTokenAlias } from "../fixtures/temporary-token-alias";
import { testEndpoint } from "../utils";
import { pathToRegexMatcher } from "../utils/routes";

describe("Temporary Token Alias", () => {
    let api: RestAPI;
    let temporaryTokenAlias: TemporaryTokenAlias;

    const recordBasePathMatcher = `${testEndpoint}/tokens/alias`;
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/tokens/alias/:id`);
    const recordData: TemporaryTokenAliasItem = generateTemporaryTokenAlias();

    beforeEach(() => {
        api = new RestAPI({ endpoint: testEndpoint });
        temporaryTokenAlias = new TemporaryTokenAlias(api);
    });

    afterEach(() => {
        fetchMock.restore();
    });

    context("POST /tokens/alias", () => {
        it("should get response", async () => {
            fetchMock.postOnce(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { "Content-Type": "application/json" },
            });
            const data: TemporaryTokenAliasCreateParams = {
                transactionTokenId: recordData.id,
                validUntil: new Date().toISOString(),
            };
            await expect(temporaryTokenAlias.create(data)).to.eventually.eql(recordData);
        });
    });

    context("GET /stores/:storeId/tokens/alias/:id", () => {
        it("should get response", async () => {
            const blobBody = await new Response(new ArrayBuffer(2)).blob();

            fetchMock.get(recordPathMatcher, (uri) => {
                const params = parse(url.parse(uri).query);
                const isBlob = params.media === TemporaryTokenAliasMedia.QR;

                return {
                    status: 200,
                    body: isBlob ? blobBody : recordData,
                    headers: {
                        "Content-Type": isBlob ? "application/octet-stream" : "application/json",
                    },
                };
            });

            const asserts: (TemporaryTokenAliasParams | TemporaryTokenAliasQrOptions)[] = [
                // JSON
                undefined,
                // Blob
                { media: TemporaryTokenAliasMedia.QR },
            ];

            for (const data of asserts) {
                const response = await temporaryTokenAlias.get(recordData.storeId, recordData.id, data);

                if (response.constructor === Object) {
                    expect(response).to.be.an("object").that.eql(recordData);
                } else {
                    expect(response).to.have.property("size").that.eql(blobBody.size);
                }
            }
        });
    });

    context("DELETE /stores/:storeId/tokens/alias/:id", () => {
        it("should get response", async () => {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { "Content-Type": "application/json" },
            });
            await expect(temporaryTokenAlias.delete(recordData.storeId, recordData.id)).to.eventually.be.empty;
        });
    });
});
