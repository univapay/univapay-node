import { expect } from "chai";
import fetchMock, { FetchMockStatic } from "fetch-mock";
import jwt from "jsonwebtoken";
import { parseUrl } from "query-string";
import sinon, { SinonSandbox } from "sinon";

import { BodyTransferType, HTTPMethod, RestAPI, RestAPIOptions } from "../../src/api/RestAPI.js";
import {
    ENV_KEY_APP_ID,
    ENV_KEY_APPLICATION_JWT,
    ENV_KEY_SECRET,
    IDEMPOTENCY_KEY_HEADER,
} from "../../src/common/constants.js";
import { APIError, ResponseErrorCode } from "../../src/errors/APIError.js";
import { fromError } from "../../src/errors/parser.js";
import { ResponseError } from "../../src/errors/RequestResponseError.js";
import { isBlob } from "../../src/utils/object.js";
import { testEndpoint } from "../utils/index.js";

describe("API", function () {
    const okResponse = { ok: true };

    let sandbox: SinonSandbox;

    beforeEach(function () {
        sandbox = sinon.createSandbox({
            properties: ["spy", "clock"],
        });
    });

    afterEach(function () {
        fetchMock.restore();
        sandbox.restore();
    });

    it("should create instance with proper parameters", function () {
        const jwtToken = jwt.sign({ foo: "bar" }, "foo");

        const asserts: [RestAPIOptions, string, string?, string?, string?, string?][] = [
            [{ endpoint: "/" }, "/", undefined, undefined, undefined, undefined],
            [{ endpoint: "/", appId: "id" }, "/", "id", undefined, undefined, undefined],
            [{ endpoint: "/", appId: "id", secret: "secret" }, "/", "id", "secret", undefined, undefined],
            [{ endpoint: "/", authToken: "token" }, "/", undefined, undefined, "token", undefined],
            [{ endpoint: "/", jwt: jwtToken }, "/", undefined, undefined, undefined, jwtToken],
        ];

        for (const [options, endpoint, appId, secret, authToken, jwt] of asserts) {
            const api: RestAPI = new RestAPI(options);

            expect(api.endpoint).to.equal(endpoint);
            expect(api.appId).to.equal(appId);
            expect(api.secret).to.equal(secret);
            expect(api.authToken).to.equal(authToken);
            expect(api.jwtRaw).to.equal(jwt);
        }
    });

    it("should take appId and secret from environment variable", function () {
        process.env[ENV_KEY_APP_ID] = "envId";
        process.env[ENV_KEY_SECRET] = "envSecret";

        const api: RestAPI = new RestAPI({ endpoint: "/" });

        expect(api.appId).to.equal("envId");
        expect(api.secret).to.equal("envSecret");

        delete process.env[ENV_KEY_APP_ID];
        delete process.env[ENV_KEY_SECRET];
    });

    it("should take jwt and secret from environment variable", function () {
        const jwtToken = jwt.sign({ foo: "bar" }, "foo");
        process.env[ENV_KEY_APPLICATION_JWT] = jwtToken;
        process.env[ENV_KEY_SECRET] = "envSecret";

        const api: RestAPI = new RestAPI({ endpoint: "/" });

        expect(api.jwt).to.deep.equal(jwt.decode(jwtToken));
        expect(api.secret).to.equal("envSecret");

        delete process.env[ENV_KEY_APPLICATION_JWT];
        delete process.env[ENV_KEY_SECRET];
    });

    it("should send request to the api", async function () {
        fetchMock.getOnce(`${testEndpoint}/ok`, {
            status: 200,
            body: okResponse,
            headers: { "Content-Type": "application/json" },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        const response = await api.send(HTTPMethod.GET, "/ok");

        expect(response).to.eql(okResponse);
    });

    it("should send request to the specified http endpoint", async function () {
        fetchMock.getOnce("http://test.univapay.com/ok", {
            status: 200,
            body: okResponse,
            headers: { "Content-Type": "application/json" },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        const response = await api.send(HTTPMethod.GET, "http://test.univapay.com/ok");

        expect(response).to.eql(okResponse);
    });

    it("should send request to the specified https endpoint", async function () {
        fetchMock.getOnce("https://test.univapay.com/ok", {
            status: 200,
            body: okResponse,
            headers: { "Content-Type": "application/json" },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        const response = await api.send(HTTPMethod.GET, "https://test.univapay.com/ok");

        expect(response).to.eql(okResponse);
    });

    it("should override jwt and secret from environment variable with auth parameter", async function () {
        const secret = "myActualSecret";
        const jwtToken = jwt.sign({ my: "payload" }, "foo");
        fetchMock.getOnce(
            `${testEndpoint}/ok`,
            {
                status: 200,
                body: okResponse,
                headers: {
                    "Content-Type": "application/json",
                },
            },
            {
                headers: { Authorization: `Bearer ${secret}.${jwtToken}` },
            },
        );

        process.env[ENV_KEY_APPLICATION_JWT] = jwt.sign({}, "foo");
        process.env[ENV_KEY_SECRET] = "envSecret";

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        const response = await api.send(HTTPMethod.GET, "/ok", null, { jwt: jwtToken, secret });

        delete process.env[ENV_KEY_APPLICATION_JWT];
        delete process.env[ENV_KEY_SECRET];

        expect(response).to.eql(okResponse);
    });

    it("should return error response", async function () {
        fetchMock.get(`${testEndpoint}/error`, { status: 503 });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        const error = new ResponseError({
            code: ResponseErrorCode.ServiceUnavailable,
            errors: [],
            httpCode: 503,
        });

        const resError = await expect(api.send(HTTPMethod.GET, "/error")).to.eventually.be.rejected;

        expect(resError).to.be.instanceOf(ResponseError);
        expect(resError.errorResponse).to.eql(error.errorResponse);
    });

    it("should send request with authorization header", async function () {
        const jwtTokenPayload = { foo: "bar" };
        const jwtToken = jwt.sign(jwtTokenPayload, "foo");
        const jwtToken1 = jwt.sign(jwtTokenPayload, "foo1");

        const asserts: [Record<string, string> | null, Record<string, string> | null, string | null][] = [
            [{}, null, null],
            [{ appId: "id" }, null, "ApplicationToken id|"],
            [{ appId: "id", secret: "secret" }, null, "ApplicationToken id|secret"],
            [{ appId: "id", secret: "secret" }, { appId: "id1" }, "ApplicationToken id1|secret"],
            [{ appId: "id", secret: "secret" }, { secret: "secret1" }, "ApplicationToken id|secret1"],
            [null, { appId: "id" }, "ApplicationToken id|"],
            [null, { appId: "id", secret: "secret" }, "ApplicationToken id|secret"],
            [{ authToken: "token" }, null, "Token token"],
            [{ authToken: "token" }, { authToken: "token1" }, "Token token1"],
            [null, { authToken: "token1" }, "Token token1"],
            [{ jwt: jwtToken }, null, `Bearer ${jwtToken}`],
            [{ jwt: jwtToken }, { jwt: jwtToken1 }, `Bearer ${jwtToken1}`],
            [null, { jwt: jwtToken1 }, `Bearer ${jwtToken1}`],
            [{ secret: "secret" }, { jwt: jwtToken1 }, `Bearer secret.${jwtToken1}`],
        ];

        const mock: FetchMockStatic = fetchMock.get(
            `${testEndpoint}/header`,
            {
                status: 200,
                body: okResponse,
                headers: { "Content-Type": "application/json" },
            },
            {
                method: HTTPMethod.GET,
                repeat: asserts.length,
            },
        );

        for (const [initParams, sendParams, authHeader] of asserts) {
            const api: RestAPI = new RestAPI({ endpoint: testEndpoint, ...initParams });
            const response = await api.send(HTTPMethod.GET, "/header", null, sendParams);
            const { request } = mock.lastCall();
            const reqAuthHeader = request.headers.get("Authorization");

            expect(reqAuthHeader).to.eql(authHeader || null);
            expect(response).to.eql(okResponse);
        }
    });

    it("should emit request event", async function () {
        fetchMock.getOnce(`${testEndpoint}/ok`, {
            status: 200,
            body: okResponse,
            headers: { "Content-Type": "application/json" },
        });

        const onRequest = sinon.spy();

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        api.on("request", onRequest);
        await api.send(HTTPMethod.GET, "/ok");

        // eslint-disable-next-line
        expect(onRequest).to.have.been.calledOnce;
        expect(onRequest.firstCall.lastArg).to.include({
            method: "GET",
            url: "http://mock-api/ok",
            body: null,
        });
    });

    it("should emit response event", async function () {
        fetchMock.getOnce(`${testEndpoint}/ok`, {
            status: 200,
            body: okResponse,
            headers: { "Content-Type": "application/json" },
        });

        const onResponse = sinon.spy();

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        api.on("response", onResponse);
        await api.send(HTTPMethod.GET, "/ok");

        // eslint-disable-next-line
        expect(onResponse).to.have.been.calledOnce;
        expect(onResponse.firstCall.lastArg)
            .to.include({
                status: 200,
                statusText: "OK",
            })
            .and.have.property("body")
            .eql(Buffer.from(JSON.stringify(okResponse)));
    });

    it("should send request with Origin header", async function () {
        interface Origin {
            origin?: string;
        }
        const asserts: [Origin | null, Origin | null][] = [
            [null, null],
            [{ origin: "origin1" }, null],
            [null, { origin: "origin2" }],
            [{ origin: "origin1" }, { origin: "origin2" }],
        ];

        const mock: FetchMockStatic = fetchMock.get(
            `${testEndpoint}/origin`,
            {
                status: 200,
                body: okResponse,
                headers: { "Content-Type": "application/json" },
            },
            {
                method: HTTPMethod.GET,
                repeat: asserts.length,
            },
        );

        for (const [initParams, sendParams] of asserts) {
            const api: RestAPI = new RestAPI({ endpoint: testEndpoint, ...initParams });
            const response = await api.send(HTTPMethod.GET, "/origin", null, sendParams);
            const { request } = mock.lastCall();
            const reqOriginHeader = request.headers.get("Origin");

            expect(reqOriginHeader).to.be.equal(
                !!sendParams && !!sendParams.origin
                    ? sendParams.origin
                    : !!initParams && !!initParams.origin
                      ? initParams.origin
                      : null,
            );
            expect(response).to.eql(okResponse);
        }
    });

    it("should set request credentials to include when userCredentials is passed through AuthParams", async function () {
        if (process.version < "v18.00") {
            // Request credentials was introduced in v18.00, so skip older versions
            this.skip();
        }
        const loginMock = fetchMock.get(`${testEndpoint}/login`, {
            status: 200,
            body: okResponse,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
                "Set-Cookie": `SESSIONID=12345; Path=/; SameSite=none`,
            },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        const response = await api.send(HTTPMethod.GET, "/login");
        const { request: loginReq } = loginMock.lastCall();
        const loginReqCredentials = loginReq.credentials;
        expect(loginReqCredentials).to.be.equal("same-origin");
        expect(response).to.eql(okResponse);

        const someReqMock = fetchMock.get(`${testEndpoint}/somerequest`, {
            status: 200,
            body: okResponse,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Credentials": "true",
            },
        });

        const someResponse = await api.send(HTTPMethod.GET, "/somerequest", null, { useCredentials: true });
        const { request } = someReqMock.lastCall();
        const reqCredentials = request.credentials;
        expect(reqCredentials).to.be.equal("include");
        expect(someResponse).to.eql(okResponse);
    });

    it("should update token if it comes back in the response", async function () {
        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        // eslint-disable-next-line
        expect(api.jwtRaw).to.be.undefined;
        // eslint-disable-next-line
        expect(api.jwt).to.be.null;

        const asserts = [
            ["header1", "Authorization"],
            ["headerAmzn1", "x-amzn-Remapped-Authorization"],
        ];

        for (const [uri, header] of asserts) {
            const jwtTokenPayload = { test: uri };
            const jwtToken = jwt.sign(jwtTokenPayload, uri);

            fetchMock.getOnce(`${testEndpoint}/${uri}`, {
                status: 200,
                body: okResponse,
                headers: {
                    "Content-Type": "application/json",
                    [header]: `Bearer ${jwtToken}`,
                },
            });

            await expect(api.send(HTTPMethod.GET, `/${uri}`)).to.eventually.be.fulfilled;
            expect(api.jwtRaw).to.equal(jwtToken);
            expect(api.jwt).to.contain(jwtTokenPayload);
        }
    });

    it("should update token if it comes back in the error response", async function () {
        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        // eslint-disable-next-line
        expect(api.jwtRaw).to.be.undefined;
        // eslint-disable-next-line
        expect(api.jwt).to.be.null;

        const asserts = [
            ["header1", "Authorization"],
            ["headerAmzn1", "x-amzn-Remapped-Authorization"],
        ];

        for (const [uri, header] of asserts) {
            const jwtTokenPayload = { test: uri };
            const jwtToken = jwt.sign(jwtTokenPayload, uri);

            fetchMock.getOnce(`${testEndpoint}/${uri}`, {
                status: 404,
                body: okResponse,
                headers: {
                    "Content-Type": "application/json",
                    [header]: `Bearer ${jwtToken}`,
                },
            });

            await expect(api.send(HTTPMethod.GET, `/${uri}`)).to.eventually.be.rejected;
            expect(api.jwtRaw).to.equal(jwtToken);
            expect(api.jwt).to.contain(jwtTokenPayload);
        }
    });

    it("should fire callback with new token if it was updated", async function () {
        const jwtToken = jwt.sign({ foo: "bar" }, "foo");

        fetchMock.getOnce(`${testEndpoint}/header`, {
            status: 200,
            body: okResponse,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        const handleToken = sandbox.spy();
        const api: RestAPI = new RestAPI({ endpoint: testEndpoint, handleUpdateJWT: handleToken });

        await api.send(HTTPMethod.GET, "/header");

        expect(handleToken).to.have.been.calledOnce.calledWith(jwtToken);
    });

    it("should send request with idempotent key", async function () {
        const mock: FetchMockStatic = fetchMock.getOnce(`${testEndpoint}/header`, {
            status: 200,
            body: okResponse,
            headers: { "Content-Type": "application/json" },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        await api.send(HTTPMethod.GET, "/header", null, { idempotentKey: "test" });

        const { request } = mock.lastCall();
        const keyHeader = request.headers.get(IDEMPOTENCY_KEY_HEADER);

        expect(keyHeader).to.equal("test");
    });

    it("should convert all params to underscore", async function () {
        const mock: FetchMockStatic = fetchMock.mock(`begin:${testEndpoint}/camel`, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        const expectationPost = {
            foo: "bar",
            fizz_buzz: true,
            bar: { barz: "foo", foo_bar: "barBar" },
            foo_foo: ["foo", "bar"],
        };
        const expectationGet = {
            foo: "bar",
            fizz_buzz: "true",
            "bar.barz": "foo",
            "bar.foo_bar": "barBar",
            "foo_foo[]": ["foo", "bar"],
        };

        const asserts = [
            { foo: "bar", fizz_buzz: true, bar: { barz: "foo", foo_bar: "barBar" }, foo_foo: ["foo", "bar"] },
            { foo: "bar", fizzBuzz: true, bar: { barz: "foo", fooBar: "barBar" }, fooFoo: ["foo", "bar"] },
        ];

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        // For request with payload
        for (const assert of asserts) {
            await api.send(HTTPMethod.POST, "/camel", assert);
            const req = (mock.lastCall() as fetchMock.MockCall).request;
            await expect(req?.json()).to.become(expectationPost);
        }

        // For request without payload
        for (const assert of asserts) {
            await api.send(HTTPMethod.GET, "/camel", assert);
            const url = mock.lastUrl();
            const { query } = parseUrl(url);
            expect(query).to.eql(expectationGet);
        }
    });

    it("should return response with camel case properties names", async function () {
        fetchMock.getOnce(`${testEndpoint}/camel`, {
            status: 200,
            body: { foo_bar: true },
            headers: { "Content-Type": "application/json" },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        const response = await api.send(HTTPMethod.GET, "/camel");

        expect(response).to.eql({ fooBar: true });
    });

    it("should ping the api", async function () {
        fetchMock.getOnce(`${testEndpoint}/heartbeat`, {
            status: 200,
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });
        await expect(api.ping()).to.eventually.be.undefined;
    });

    it("should not throw an error for open routes even if token is expired", async function () {
        const dateNow = new Date();
        const jwtToken = jwt.sign(
            {
                exp: Math.round(dateNow.getTime() / 1000) - 1000,
                foo: "bar",
            },
            "foo",
        );

        fetchMock.getOnce(`${testEndpoint}/heartbeat`, {
            status: 200,
            body: okResponse,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint, jwt: jwtToken });
        await expect(api.ping()).to.eventually.be.fulfilled;
    });

    it("should return unknown error", async function () {
        const error = new Error("Test");

        expect(fromError(error)).to.be.instanceOf(ResponseError).and.to.have.property("errorResponse").that.eql({
            status: "error",
            code: ResponseErrorCode.UnknownError,
            errors: [],
        });

        const errorApi = new APIError(422);

        expect(fromError(errorApi)).to.be.instanceOf(ResponseError).and.to.have.property("errorResponse").that.eql({
            status: "error",
            httpCode: 422,
            code: ResponseErrorCode.UnknownError,
            errors: [],
        });
    });

    it("should parse JSON only if proper header is present in the response", async function () {
        const blobBody = await new Response(new ArrayBuffer(2) as ArrayBuffer).blob();
        const asserts = [
            ["json", { foo: "bar" }, "application/json"],
            ["raw", "foo", "text/plain"],
            ["blob", blobBody, "application/octet-stream"],
            ["unknown", blobBody, undefined],
            // TODO: We can't really test form-data case in NodeJS environment at this point
            // ["form-data", new FormData(), "multipart/form-data"],
        ];

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        for (const [uri, body, mime] of asserts) {
            fetchMock.getOnce(`${testEndpoint}/${uri}`, {
                status: 200,
                body,
                headers: mime ? { "Content-Type": String(mime) } : {},
            });

            const response = await api.send(HTTPMethod.GET, `/${uri}`);

            if (typeof response === "object") {
                if (isBlob(response)) {
                    expect(response)
                        .to.have.property("size")
                        .that.eql((body as Blob).size);
                } else {
                    expect(response).to.be.an("object");
                }
            } else {
                expect(response)
                    .to.eql(body)
                    .and.be.a(typeof body);
            }
        }
    });

    it("should use default body transfer encoding", async function () {
        const url = "http://mock-api/encoding";
        const payload = { foo: 1, bar: "foobar" };
        const requestToJson = (request: Request | undefined, hasPayload: boolean) =>
            hasPayload ? request?.json() : new Promise((resolve) => resolve(request?.body));
        const mock: FetchMockStatic = fetchMock.mock(`begin:${testEndpoint}/encoding`, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        const asserts: {
            method: HTTPMethod;
            transfer: BodyTransferType;
            override?: BodyTransferType;
            result?: BodyTransferType;
        }[] = [
            // Default cases
            { method: HTTPMethod.POST, transfer: "entity" },
            { method: HTTPMethod.PATCH, transfer: "entity" },
            { method: HTTPMethod.PUT, transfer: "entity" },
            { method: HTTPMethod.OPTION, transfer: "entity" },
            { method: HTTPMethod.DELETE, transfer: "message" },
            { method: HTTPMethod.GET, transfer: "message" },
            { method: HTTPMethod.HEAD, transfer: "message" },

            // Transfer encoding overrides
            { method: HTTPMethod.POST, transfer: "entity", override: "message" },
            { method: HTTPMethod.PATCH, transfer: "entity", override: "message" },
            { method: HTTPMethod.PUT, transfer: "entity", override: "message" },
            { method: HTTPMethod.OPTION, transfer: "entity", override: "message" },
            { method: HTTPMethod.DELETE, transfer: "message", override: "entity" },

            // Transfer encoding override exception: Can not be overriden by web specs
            { method: HTTPMethod.GET, transfer: "message", override: "entity", result: "message" },
            { method: HTTPMethod.HEAD, transfer: "message", override: "entity", result: "message" },
        ];

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        // For request with payload
        for (const { method, transfer, override = transfer, result = override } of asserts) {
            const hasEntityPayload = result === "entity";

            await api.send(method, "/encoding", payload, undefined, { bodyTransferEncoding: override });
            const req = (mock.lastCall() as fetchMock.MockCall).request;

            expect(req!.url).to.eql(!hasEntityPayload ? `${url}?bar=foobar&foo=1` : url);
            expect(requestToJson(req, hasEntityPayload)).to.become(hasEntityPayload ? payload : null);
        }
    });

    it("should use query impersonate", async function () {
        const url = "http://mock-api/encoding";
        const payload = { foo: 1, bar: "foobar" };
        const mock: FetchMockStatic = fetchMock.mock(`begin:${testEndpoint}/encoding`, {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        await api.send(HTTPMethod.POST, "/encoding", payload, undefined, { queryImpersonate: "1234" });
        const postReq = (mock.lastCall() as fetchMock.MockCall).request;
        expect(postReq!.url).to.eql(`${url}?impersonate=1234`);
        expect(postReq?.json()).to.become(payload);

        await api.send(HTTPMethod.GET, "/encoding", payload, undefined, { queryImpersonate: "1234" });
        const getReq = (mock.lastCall() as fetchMock.MockCall).request;
        expect(getReq!.url).to.eql(`${url}?bar=foobar&foo=1&impersonate=1234`);
        expect(getReq?.body).to.eq(null);
    });

    it("should send the manual query", async function () {
        const payload = { foo: 1, bar: "foobar" };
        fetchMock.mock(`begin:${testEndpoint}/redirect`, {
            status: 303,
            headers: { "Content-Type": "application/json", "Location": "http://mock-api-redirect/test" },
        });
        fetchMock.mock("begin:http://mock-api-redirect/test", {
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: okResponse,
        });

        const api: RestAPI = new RestAPI({ endpoint: testEndpoint });

        const response = await api.send(HTTPMethod.GET, "/redirect", payload, undefined, {
            requestInit: { redirect: "manual" },
        });
        expect(response).to.eql(okResponse);
    });
});
