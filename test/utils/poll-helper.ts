import { expect } from "chai";
import fetchMock from "fetch-mock";
import * as sinon from "sinon";

import { HTTPMethod } from "../../src/api/RestAPI.js";
import { POLLING_INTERVAL, POLLING_TIMEOUT } from "../../src/common/constants.js";
import { TimeoutError } from "../../src/errors/TimeoutError.js";

const tickPoll = async (sandbox: sinon.SinonSandbox, ticks = 3) => {
    for (let i = 0; i < ticks; i++) {
        await sandbox.clock.tickAsync(POLLING_INTERVAL);
    }
};

const timeoutPoll = async (sandbox: sinon.SinonSandbox) => {
    await sandbox.clock.tickAsync(POLLING_TIMEOUT);
};

export const assertPoll = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
    successItem: Item,
    pendingItem: Item | Item[]
) => {
    const pendingItems = Array.isArray(pendingItem) ? pendingItem : [pendingItem];

    pendingItems.forEach((item, index) => {
        fetchMock.getOnce(
            pathMatcher,
            {
                status: 200,
                body: item,
                headers: { "Content-Type": "application/json" },
            },
            { method: HTTPMethod.GET, name: `pending-item-index-${index}` }
        );
    });

    fetchMock.getOnce(
        pathMatcher,
        {
            status: 200,
            body: successItem,
            headers: { "Content-Type": "application/json" },
        },
        { method: HTTPMethod.GET, name: "success" }
    );

    // Adding an extra pending call to ensure the success callback is trigger correctly
    fetchMock.get(
        pathMatcher,
        {
            status: 200,
            body: pendingItems[0],
            headers: { "Content-Type": "application/json" },
        },
        { method: HTTPMethod.GET, name: "success-callback-sanity-check" }
    );

    const request = call();
    await tickPoll(sandbox, pendingItems.length + 2);

    await expect(request).to.eventually.eql(successItem);
};

export const assertPollCancel = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
    failingItem: Item,
    pendingItem: Item | Item[]
) => {
    const pendingItems = Array.isArray(pendingItem) ? pendingItem : [pendingItem];

    pendingItems.forEach((item, index) => {
        fetchMock.getOnce(
            pathMatcher,
            {
                status: 200,
                body: item,
                headers: { "Content-Type": "application/json" },
            },
            { method: HTTPMethod.GET, name: `pending-item-index-${index}` }
        );
    });

    fetchMock.getOnce(
        pathMatcher,
        {
            status: 200,
            body: failingItem,
            headers: { "Content-Type": "application/json" },
        },
        { method: HTTPMethod.GET, name: "success" }
    );

    // Adding an extra pending call to ensure the success callback is trigger correctly
    fetchMock.get(
        pathMatcher,
        {
            status: 200,
            body: pendingItems[0],
            headers: { "Content-Type": "application/json" },
        },
        { method: HTTPMethod.GET, name: "success-callback-sanity-check" }
    );

    const request = call();
    await tickPoll(sandbox, pendingItems.length + 2);

    await expect(request).to.eventually.eql(null);
};

export const assertPollTimeout = async <Item>(
    pathMatcher: fetchMock.MockMatcher,
    call: () => Promise<Item>,
    sandbox: sinon.SinonSandbox,
    pendingItem: Item
) => {
    fetchMock.get(pathMatcher, {
        status: 200,
        body: pendingItem,
        headers: { "Content-Type": "application/json" },
    });

    const request = call();
    await timeoutPoll(sandbox);

    await expect(request).to.eventually.be.rejectedWith(TimeoutError);
};
