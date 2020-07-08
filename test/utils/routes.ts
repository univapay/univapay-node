import { MockMatcher } from "fetch-mock";
import pathToRegex from "path-to-regexp";

export const pathToRegexMatcher = (path: string): MockMatcher => {
    return (url: string | { url: string }) => pathToRegex(path).exec(typeof url === "object" ? url.url : url) !== null;
};
