/**
 *  @internal
 *  @module Utils
 */
export declare function parseJSON(response: Response, ignoreKeys?: string[]): Promise<any>;
export declare function checkStatus(response: Response): Promise<Response>;
