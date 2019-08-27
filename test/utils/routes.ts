import pathToRegex from 'path-to-regexp';
import { MockMatcher } from 'fetch-mock';

export function pathToRegexMatcher(path: string): MockMatcher {
    return function(url: any) {
        return pathToRegex(path).exec(typeof url === 'object' ? url.url : url) !== null;
    };
}
