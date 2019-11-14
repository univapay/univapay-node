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
[es-module-url]: https://npmjs.com/package/univapay-node-es
[es-url]: http://www.ecma-international.org/ecma-262/6.0/
[tree-url]: https://developer.mozilla.org/en-US/docs/Glossary/Tree_shaking

[shield-circle-ci]: https://circleci.com/gh/univapay/univapay-node/tree/master.svg?style=svg
[shield-node]: https://img.shields.io/node/v/univapay-node.svg
[shield-npm]: https://img.shields.io/npm/v/univapay-node.svg
[shield-downloads]: https://img.shields.io/npm/dm/univapay-node.svg
[shield-license]: https://img.shields.io/npm/l/univapay-node.svg
[shield-dependencies]: https://img.shields.io/david/univapay/univapay-node.svg
[shield-devDependencies]: https://img.shields.io/david/dev/univapay/univapay-node.svg
[shield-optionalDependencies]: https://img.shields.io/david/optional/univapay/univapay-node.svg
[shield-coverage]: https://coveralls.io/repos/github/univapay/univapay-node/badge.svg?branch=master
[shield-issues]: https://img.shields.io/github/issues/univapay/univapay-node.svg
[shield-pullRequests]: https://img.shields.io/github/issues-pr/univapay/univapay-node.svg
[shield-cla]: https://cla-assistant.io/readme/badge/univapay/univapay-node

univapay-node
==========

SDK library for [Node.js][node] to consume [UnivaPay][univapay-url] API.

[![CircleCI][shield-circle-ci]][circle-ci-url]
[![NPM version][shield-npm]][npm-url]
[![Node.js version support][shield-node]][node]
[![Code coverage][shield-coverage]][coveralls-url]
![Dependencies][shield-dependencies]
![Dev Dependencies][shield-devDependencies]
![Optional Dependencies][shield-optionalDependencies]
[![GitHub Issues][shield-issues]][github-issues-url]
[![GitHub Pull Requests][shield-pullRequests]][github-pr-url]
[![CLA assistant][shield-cla]][cla-url]
[![MIT licensed][shield-license]][license-url]

Table of Contents
-----------------

  * [Requirements](#requirements)
  * [Installation](#installation)
  * [Usage](#usage)
    * [Customize](#customize)
    * [API Documentation](#api-documentation)
    * [TypeScript](#typescript)
    * [Browser Usage](#browser-usage)
  * [Contributing](#contributing)
  * [License](#license)


Requirements
------------

`univapay-node` requires the following to run:

  * [Node.js][node] 10 or 12
  * [npm][npm] (normally comes with Node.js) or [yarn][yarn]


Installation
------------

UnivaPay Node SDK is easiest to use when installed with [npm][npm]:

```bash
npm install univapay-node
```
or with [yarn][yarn]:
```bash
yarn add univapay-node
```

Usage
-----

Just import the module into your code with, create an instance of it and you're set:

```javascript
import SDK from "univapay-node";

const sdk = new SDK();
```

### Customize

You can create your own `SDK` object configuration that only contains selected resources. In the following example show
how to prepare a class that only has `Stores` resources available:

```javascript
import { PaymentsSDK } from "univapay-node/sdk/PaymentsSDK";

import { Stores } from "univapay-node/resources";
// OR directly
import { Stores } from "univapay-node/resources/Stores";

class CustomSDK extends PaymentsSDK {
    constructor (options?: RestAPIOptions) {
        super(options);
        this.stores = new Stores(this.api);
    }
}

const customSdk = new CustomSDK();
```

### API Documentation

WIP

### TypeScript

The library is written in TypeScript and thus type definitions are already included. You can just import compnents of the SDK as usual.

### Browser usage

This module is primarily design for [Node.js][node], However it is possible
to use it in the browser when it is transpiled by a bundler such as [Webpack][webpack] or [Rollup][rollup].

For optimizing your build and making it smaller you can also use a module [`univapay-node-es`][es-module-url] which is exported
as [ES][es-url] module and thus supports [Tree shaking][tree-url].


Contributing
------------

To contribute to `univapay-node`, clone this repo locally and commit your code on a separate branch. Please write unit tests for your code
and run the linter before opening a pull request:

```bash
npm test        # run the tests
```

```bash
npm run linter  # run the linter
```


License
-------

`univapay-node` is licensed under the [MIT][license-url] license.
Copyright &copy; 2019, [UnivaPay][univapay-url] Team
