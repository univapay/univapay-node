import bowser from "bowser";
import { isBrowser, isNode } from "browser-or-node";

const CLIENT_NAME = "univapay-node";

function getPlatform() {
    if (isNode) {
       return `node.js@${process.versions.node}`;
    }

    if (isBrowser) {
        const { browser: { name, version } } = bowser.parse(window.navigator.userAgent);

        return `${name}@${version}`;
    }

    return "uknown-platform"
}

function getModuleType() {
    return typeof require === 'function' ? 'commonjs' : 'module';
}

export function userAgent() {
    return  `${CLIENT_NAME} ${getPlatform()} ${getModuleType()}`;
}
