import { RouteMatcher } from "fetch-mock";
import { pathToRegexp } from "path-to-regexp";

import { testEndpoint } from "./index.js";

const extractPathFromUrl = (url: string) => url.replace(testEndpoint, "").split("?")[0];

export const pathToRegexMatcher = (urlMatcher: string): RouteMatcher => {
    const { regexp } = pathToRegexp(urlMatcher.replace(testEndpoint, ""));

    return ({ url }) => regexp.exec(extractPathFromUrl(url)) !== null;
};
