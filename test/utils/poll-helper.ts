import arrify from "arrify";
import { expect } from "chai";
import fetchMock from "fetch-mock";
import pMap from "p-map";
import * as sinon from "sinon";

import { POLLING_INTERVAL, POLLING_TIMEOUT } from "../../src/common/constants.js";
import { TimeoutError } from "../../src/errors/TimeoutError.js";

const tickPoll = (sandbox: sinon.SinonSandbox, ticks = 3) =>
    pMap(Array(ticks).fill(0), () => sandbox.clock.tickAsync(POLLING_INTERVAL), { concurrency: 1 });

const timeoutPoll = (sandbox: sinon.SinonSandbox) => sandbox.clock.tickAsync(POLLING_TIMEOUT);

const headers = { "Content-Type": "application/json" };
const mockFetchGetOnce = <Item>(pathMatcher: fetchMock.MockMatcher, name: string, body: Item, status = 200) =>
    fetchMock.getOnce(pathMatcher, { status, body, headers }, { name });

const mockFetchGet = <Item>(pathMatcher, name: string, body: Item, status = 200) =>
    fetchMock.get(pathMatcher, { status, body, headers }, { name });

export const assertPoll = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
    successItem: Item,
    pendingItem: Item | Item[],
) => {
    const pendingItems = arrify(pendingItem);

    pendingItems.forEach((item, index) => mockFetchGetOnce(pathMatcher, `pending-item-index-${index}`, item));
    mockFetchGetOnce(pathMatcher, "success", successItem);
    mockFetchGet(pathMatcher, "success-callback-sanity-check", pendingItems[0]);

    const request = call();
    await tickPoll(sandbox, pendingItems.length + 2);

    await expect(request).to.become(successItem);
};

export const assertPollCancel = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
    cancelItem: Item,
    pendingItem: Item | Item[],
) => {
    const pendingItems = arrify(pendingItem);

    pendingItems.forEach((item, index) => mockFetchGetOnce(pathMatcher, `pending-item-index-${index}`, item));
    mockFetchGetOnce(pathMatcher, "cancel", cancelItem);
    mockFetchGet(pathMatcher, "cancel-callback-sanity-check", pendingItems[0]);

    const request = call();
    await tickPoll(sandbox, pendingItems.length + 2);

    await expect(request).to.become(null);
};

export const assertPollTimeout = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
    pendingItem: Item,
) => {
    mockFetchGet(pathMatcher, "pending", pendingItem);

    const request = call();
    await timeoutPoll(sandbox);

    await expect(request).to.eventually.be.rejectedWith(TimeoutError);
};

export const assertPollNotFoundError = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
) => {
    mockFetchGetOnce(pathMatcher, "not-found-error", "", 404);
    mockFetchGet(pathMatcher, "cancel-callback-sanity-check", "");

    // Success on reject instead of resolve as we want to assert the error rethrow
    const request = call()
        .then(() => expect.fail())
        .catch((error) => expect(error.errorResponse.code).eql("NOT_FOUND"));
    await tickPoll(sandbox, 1);

    await request;
};

export const assertPollInternalServerError = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
    successItem: Item,
) => {
    mockFetchGetOnce(pathMatcher, "internal-server-error", "", 500);
    mockFetchGet(pathMatcher, "cancel-callback-sanity-check", successItem);

    const request = call();
    await tickPoll(sandbox, 2);

    await expect(request).to.become(successItem);
};

export const assertPollInternalServerErrorMaxRetry = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
) => {
    mockFetchGet(pathMatcher, "internal-server-error", "", 500);

    // Success on reject instead of resolve as we want to assert the error rethrow
    const request = call()
        .then(() => expect.fail())
        .catch((error) => expect(error.errorResponse.code).eql("INTERNAL_SERVER_ERROR"));
    await tickPoll(sandbox, 4);

    await request;
};
