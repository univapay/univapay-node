/**
 *  @internal
 *  @module Utils
 */
import { Omit } from 'type-zoo';
export declare type Transformer = (...args: any[]) => string;
export declare function transformKeys(obj: any, transformer: Transformer, ignoreKeys?: string[]): any;
export declare function missingKeys(obj: any, keys?: string[]): string[];
export declare function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
