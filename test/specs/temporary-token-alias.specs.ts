import { expect } from 'chai';
import fetchMock from 'fetch-mock';
import { testEndpoint } from '../utils';
import { pathToRegexMatcher } from '../utils/routes';
import { RestAPI } from '../../src/api/RestAPI';
import { generateFixture as generateTemporaryTokenAlias } from '../fixtures/temporary-token-alias';
import {
    TemporaryTokenAliasItem,
    TemporaryTokenAlias,
    TemporaryTokenAliasCreateParams,
    TemporaryTokenAliasMedia,
    TemporaryTokenAliasQrOptions,
    TemporaryTokenAliasParams,
} from '../../src/resources/TemporaryTokenAlias';
import { parse } from 'query-string';
import { Response } from 'node-fetch';
import url from 'url';

describe('Temporary Token Alias', function() {
    let api: RestAPI;
    let temporaryTokenAlias: TemporaryTokenAlias;

    const recordBasePathMatcher = `${testEndpoint}/tokens/alias`;
    const recordPathMatcher = pathToRegexMatcher(`${testEndpoint}/stores/:storeId/tokens/alias/:id`);
    const recordData: TemporaryTokenAliasItem = generateTemporaryTokenAlias();

    beforeEach(function() {
        api = new RestAPI({ endpoint: testEndpoint });
        temporaryTokenAlias = new TemporaryTokenAlias(api);
    });

    afterEach(function() {
        fetchMock.restore();
    });

    context('POST /tokens/alias', function() {
        it('should get response', async function() {
            fetchMock.postOnce(recordBasePathMatcher, {
                status: 201,
                body: recordData,
                headers: { 'Content-Type': 'application/json' },
            });
            const data: TemporaryTokenAliasCreateParams = {
                transactionTokenId: recordData.id,
                validUntil: new Date().toISOString(),
            };
            await expect(temporaryTokenAlias.create(data)).to.eventually.eql(recordData);
        });
    });

    context('GET /stores/:storeId/tokens/alias/:id', function() {
        it('should get response', async function() {
            const blobBody = await new Response(new ArrayBuffer(2)).blob();

            fetchMock.get(recordPathMatcher, uri => {
                const params = parse(url.parse(uri).query);
                const isBlob = params.media === TemporaryTokenAliasMedia.QR;

                return {
                    status: 200,
                    body: isBlob ? blobBody : recordData,
                    headers: {
                        'Content-Type': isBlob ? 'application/octet-stream' : 'application/json',
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
                    expect(response)
                        .to.be.an('object')
                        .that.eql(recordData);
                } else {
                    expect(response)
                        .to.have.property('size')
                        .that.eql((blobBody as any).size);
                }
            }
        });
    });

    context('DELETE /stores/:storeId/tokens/alias/:id', function() {
        it('should get response', async function() {
            fetchMock.deleteOnce(recordPathMatcher, {
                status: 204,
                headers: { 'Content-Type': 'application/json' },
            });
            await expect(temporaryTokenAlias.delete(recordData.storeId, recordData.id)).to.eventually.be.empty;
        });
    });
});
