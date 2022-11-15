import bowser from "bowser";
import { isBrowser, isNode } from "browser-or-node";

const CLIENT_NAME = "univapay-node";

const getPlatform = () =>
    isNode
        ? `node.js@${process.versions.node}`
        : /* c8 ignore next 8 */
        isBrowser
        ? (() => {
              const {
                  browser: { name, version },
              } = bowser.parse(window.navigator.userAgent);

              return `${name}@${version}`;
          })()
        : "unknown-platform";

const getModuleType = () => (typeof require === "function" ? "commonjs" : "module");

export const userAgent = () => `${CLIENT_NAME} ${getPlatform()} ${getModuleType()}`;
