[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
[webpack]: https://webpack.js.org/
[rollup]: https://rollupjs.org/
[univapay-url]: https://univapay.com/
[npm-url]: https://www.npmjs.com/package/univapay-node
[build-url]: https://github.com/univapay/univapay-node/actions
[github-url]: https://github.com/univapay/univapay-node/
[github-issues-url]: https://github.com/univapay/univapay-node/issues
[github-pr-url]: https://github.com/univapay/univapay-node/pulls
[coveralls-url]: https://coveralls.io/github/univapay/univapay-node?branch=master
[license-url]: https://github.com/univapay/univapay-node/blob/master/LICENSE
[cla-url]: https://cla-assistant.io/univapay/univapay-node
[shield-node]: https://img.shields.io/node/v/univapay-node.svg
[shield-npm]: https://img.shields.io/npm/v/univapay-node.svg
[shield-build]: https://img.shields.io/github/workflow/status/univapay/univapay-node/test/master
[shield-downloads]: https://img.shields.io/npm/dm/univapay-node.svg
[shield-license]: https://img.shields.io/npm/l/univapay-node.svg
[shield-coverage]: https://coveralls.io/repos/github/univapay/univapay-node/badge.svg?branch=master
[shield-issues]: https://img.shields.io/github/issues/univapay/univapay-node.svg
[shield-pullrequests]: https://img.shields.io/github/issues-pr/univapay/univapay-node.svg
[shield-cla]: https://cla-assistant.io/readme/badge/univapay/univapay-node

# univapay-node

SDK library for [Node.js][node] to consume [UnivaPay][univapay-url] API.

[日本語](README.md)

[![Github Actions][shield-build]][build-url]
[![NPM version][shield-npm]][npm-url]
[![Node.js version support][shield-node]][node]
[![Code coverage][shield-coverage]][coveralls-url]
[![GitHub Issues][shield-issues]][github-issues-url]
[![GitHub Pull Requests][shield-pullrequests]][github-pr-url]
[![CLA assistant][shield-cla]][cla-url]
[![MIT licensed][shield-license]][license-url]

## Installation

```bash
# With npm (preferred)
npm install --save univapay-node

# With yarn
yarn add univapay-node
```

## Usage

### Requirements

If you do not already have your store application token, please create it first:

-   Go to the `Store` > Select store > `For developers` > `Application tokens` page
-   Click on `Add`
-   Add your domain and your mode
-   Copy the JWT from the created token
-   Do not forget to store your secret

### Setup SDK

```typescript
import SDK from "univapay-node";
// In environments where fetch is not provided, please use the following polyfills:
// import "cross-fetch/polyfill"
// import "isomorphic-form-data"

const apiEndpoint = "https://api.univapay.com";
const storeJwt = jwt; // see `Requirements`
const storeJwtSecret = secret; // see `Requirements`

const sdk = new SDK({
    endpoint: apiEndpoint,
    jwt: storeJwt,
    secret: storeJwtSecret,
});
```

### Create charge

```typescript
import SDK, { PaymentType, TransactionTokenType, ResponseError } from "univapay-node";

const sdk = new SDK({ endpoint, jwt, secret });

// Create charge token
let transactionToken;
try {
  const transactionToken = await sdk.transactionTokens.create({
    type: TransactionTokenType.ONE_TIME, // Can be used only once
    paymentType: PaymentType.CARD,

    // Data type varies depending on the payment type
    data: { cardholder, cardNumber, expMonth, expYear, cvv }
  });
} catch (tokenCreateError: ResponseError) {
  handleError(tokenCreateError);
}

// Create charge
try {
  const charge = await sdk.charges.create({
    amount: 1000;
    currency: "JPY",
    transactionTokenId: transactionToken.id,
  });
} catch (chargeCreateError: ResponseError) {
  // Cleanup unused token to recreate another one for the next charge
  await sdk.transactionTokens.delete(transactionToken.id);

  handleError(chargeCreateError);
}
```

### Polling

After creating a charge the status will be initialized to `pending`. It will become `successful` or `failed`after API fully processes it. You can poll the charge if you need to know when the charge becomes `failed` or `successful`:

```typescript
import SDK, {
    PaymentType,
    TransactionTokenType,
    ResponseError,
} from "univapay-node";

const sdk = new SDK({ endpoint, jwt, secret });

const transactionToken = await sdk.transactionTokens.create(/* */);
const createdCharge = await sdk.charges.create(/* */); // Pending status

const charge = await sdk.charges.poll(
    createdCharge.storeId,
    createdCharge.id,
    null,
    null,
    null,

    // Condition where the poll should stop and return null
    // Optional: (charge: ResponseCharge) => boolean
    cancelCondition,

    // Condition where the poll should succeed. By default when the status is not Pending.
    // Optional: (charge: ResponseCharge) => boolean
    successCondition,
);
```

### Create authorization charge

By default, creating a charge captures it. If you need to authorize it instead, you can do so passing the `capture` property set to `false` with an optional `captureAt` property to automatically capture at a certain date:

```typescript
const charge = await sdk.charges.create({
  amount: 1000;
  currency: "JPY",
  transactionTokenId: transactionToken.id,
  capture: false, // Do not capture the charge directly
  captureAt: "2020-08-12", // Optional
});
```

## API Documentation

### Events

The `PaymentsSDK` and `Resource` based classes such as `Charges` and `Stores` are [EventEmitters](https://nodejs.org/api/events.html). You can subscribe to the following events:

```javascript
const sdk = new SDK();
sdk.on('request', (req: Request) => void)
sdk.on('response', (res: Response) => void)
```

`Request` and `Response` are the [`fetch` API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) types.

## Browser usage

This module is primarily design for [Node.js][node], However it is possible
to use it in the browser when it is transpiled by a bundler such as [Webpack][webpack] or [Rollup][rollup].

## Contributing

To contribute to `univapay-node`, clone this repo locally and commit your code on a separate branch. Please write unit tests for your code
and run the lint before opening a pull request:

```bash
npm run lint -- --fix
npm run format

npm test
```

## License

`univapay-node` is licensed under the [MIT][license-url] license.
Copyright &copy; 2019, [UnivaPay][univapay-url] Team
