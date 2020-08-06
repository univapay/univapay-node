import { MockMatcher } from "fetch-mock";
import { pathToRegexp } from "path-to-regexp";

import { testEndpoint } from ".";

const extractPathFromUrl = (url: string) => url.replace(testEndpoint, "").split("?")[0];

export const pathToRegexMatcher = (urlMatcher: string): MockMatcher => {
    const regExp = pathToRegexp(urlMatcher.replace(testEndpoint, ""));

    return (url: string | { url: string }) => {
        return regExp.exec(extractPathFromUrl(typeof url === "object" ? url.url : url)) !== null;
    };
};
