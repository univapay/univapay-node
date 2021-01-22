[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[yarn]: https://yarnpkg.com/
[webpack]: https://webpack.js.org/
[rollup]: https://rollupjs.org/
[circle-ci-url]: https://circleci.com/gh/univapay/univapay-node/tree/master
[univapay-url]: https://univapay.com/
[npm-url]: https://www.npmjs.com/package/univapay-node
[github-url]: https://github.com/univapay/univapay-node/
[github-issues-url]: https://github.com/univapay/univapay-node/issues
[github-pr-url]: https://github.com/univapay/univapay-node/pulls
[coveralls-url]: https://coveralls.io/github/univapay/univapay-node?branch=master
[license-url]: https://github.com/univapay/univapay-node/blob/master/LICENSE
[cla-url]: https://cla-assistant.io/univapay/univapay-node
[shield-circle-ci]: https://circleci.com/gh/univapay/univapay-node/tree/master.svg?style=svg
[shield-node]: https://img.shields.io/node/v/univapay-node.svg
[shield-npm]: https://img.shields.io/npm/v/univapay-node.svg
[shield-downloads]: https://img.shields.io/npm/dm/univapay-node.svg
[shield-license]: https://img.shields.io/npm/l/univapay-node.svg
[shield-dependencies]: https://img.shields.io/david/univapay/univapay-node.svg
[shield-devdependencies]: https://img.shields.io/david/dev/univapay/univapay-node.svg
[shield-optionaldependencies]: https://img.shields.io/david/optional/univapay/univapay-node.svg
[shield-coverage]: https://coveralls.io/repos/github/univapay/univapay-node/badge.svg?branch=master
[shield-issues]: https://img.shields.io/github/issues/univapay/univapay-node.svg
[shield-pullrequests]: https://img.shields.io/github/issues-pr/univapay/univapay-node.svg
[shield-cla]: https://cla-assistant.io/readme/badge/univapay/univapay-node

# univapay-node

[Node.js][node]が[UnivaPay][univapay-url]API を使用するための SDK ライブラリです。

[English readme](README.en.md)

[![CircleCI][shield-circle-ci]][circle-ci-url]
[![NPM version][shield-npm]][npm-url]
[![Node.js version support][shield-node]][node]
[![Code coverage][shield-coverage]][coveralls-url]
![Dependencies][shield-dependencies]
![Dev Dependencies][shield-devdependencies]
![Optional Dependencies][shield-optionaldependencies]
[![GitHub Issues][shield-issues]][github-issues-url]
[![GitHub Pull Requests][shield-pullrequests]][github-pr-url]
[![CLA assistant][shield-cla]][cla-url]
[![MIT licensed][shield-license]][license-url]

## インストール

```bash
# npm (推奨)
npm install --save univapay-node

# yarn
yarn add univapay-node
```

## 利用方法

### 準備

ストアアプリケーショントークンがない場合は、まず以下の手順で作成してください。

-   `店舗` > 店舗を選択 > `開発` > `アプリトークン` ページに移動
-   `追加` をクリック
-   ドメインとモードを追加する
-   作成されたトークンから JWT をコピーする
-   シークレットを保存することを忘れないでください

### SDK のセットアップ

```typescript
import SDK from "univapay-node";

const apiEndpoint = "https://api.univapay.com";
const storeJwt = jwt; // `準備`を参照
const storeJwtSecret = secret; // `準備`を参照

const sdk = new SDK({
    endpoint: apiEndpoint,
    jwt: storeJwt,
    secret: storeJwtSecret,
});
```

### 課金を作成する

```typescript
import SDK, { PaymentType, TransactionTokenType, ResponseError } from "univapay-node";

const sdk = new SDK({ endpoint, jwt, secret });

// 課金用のトークンを作成
let transactionToken;
try {
  const transactionToken = await sdk.transactionTokens.create({
    type: TransactionTokenType.ONE_TIME, // 1回のみ利用可
    paymentType: PaymentType.CARD,

    // データの型は決済方法によって異なります
    data: { cardholder, cardNumber, expMonth, expYear, cvv }
  });
} catch (tokenCreateError: ResponseError) {
  handleError(tokenCreateError);
}

// 課金を作成
try {
  const charge = await sdk.charges.create({
    amount: 1000;
    currency: "JPY",
    transactionTokenId: transactionToken.id,
  });
} catch (chargeCreateError: ResponseError) {
  // 未使用のトークンをクリーンアップして、次の課金のために別のトークンを再作成します
  await sdk.transactionTokens.delete(transactionToken.id);

  handleError(chargeCreateError);
}
```

### ポーリング

課金を作成した後、ステータスは`pending`に初期化されます。 API が完全に処理し終わると、`successful`または`failed`になります。課金が`failed`または`successful`になったタイミングを知る必要がある場合は、課金をポーリングすることができます。

```typescript
import SDK, {
    PaymentType,
    TransactionTokenType,
    ResponseError
} from "univapay-node";

const sdk = new SDK({ endpoint, jwt, secret });

const transactionToken = await sdk.transactionTokens.create(/* */);
const createdCharge = await sdk.charges.create(/* */); // Pending ステータス

const charge = await sdk.charges.poll(
    createdCharge.storeId,
    createdCharge.id,
    null,
    null,
    null,

    // ポーリングが停止してnullを返す条件
    // 任意: (charge：ResponseCharge) => boolean
    cancelCondition,

    // ポーリングが成功する条件。デフォルトは、statusがpendingではないこと
    // 任意: (charge: ResponseCharge) => boolean
    successCondition
);
```

### 認証が必要な課金の作成

デフォルトでは、課金を作成するとそのままキャプチャされます。そうではなく、認証する必要がある場合は、`capture`プロパティを `false`に設定し、任意の`captureAt`プロパティを指定して特定の日付で自動的にキャプチャするようにすることができます。

```typescript
const charge = await sdk.charges.create({
  amount: 1000;
  currency: "JPY",
  transactionTokenId: transactionToken.id,
  capture: false, // 課金を直接はキャプチャしない
  captureAt: "2020-08-12", // 任意
});
```

## API リファレンス

### イベント

`Charges`や`Stores`などの、`PaymentsSDK`および`Resource`ベースのクラスは[EventEmitter](https://nodejs.org/api/events.html)です。次のイベントをサブスクライブできます。

```javascript
const sdk = new SDK();
sdk.on('request', (req: Request) => void)
sdk.on('response', (res: Response) => void)
```

`Request`と`Response`は[`fetch`API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API)の型です。

## ブラウザでの利用方法

このモジュールは主に[Node.js][node]用に設計されていますが、[Webpack][webpack]や[Rollup][rollup]などのバンドラによってトランスパイルされたときに、ブラウザで使用することができます。

## コントリビュート

`univapay-node`の開発に寄与するには、このリポジトリをローカルで clone し、コードを別のブランチとして commit します。その際、コードの単体テストを記述し、プルリクエストを作成する前に Lint を実行してください。

```bash
npm run lint -- --fix
npm run format

npm test
```

## ライセンス

`univapay-node`は、[MIT][license-url]ライセンスの下で配布されています。

Copyright &copy; 2019, [UnivaPay][univapay-url] Team
