import { IModuleDictionary, IModule } from "./ckc";
/**
 *
 * "startLine": 2,
 * "endLine": 2,
 * "startColumn": 14,
 * "endColumn": 19,
 *
 */
export declare const getStartToken: (tokenId: any) => ITokenStart;
export interface ITokenStart {
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
}
export declare const flatten: <T>(items: T[]) => T[];
export declare const purge: <T>(items: T[]) => T[];
export declare const clone: (source: any, template?: any) => any;
/**
 * Fold a long line and intersperse with newlines at certain intervals
 * @param s - input string
 * @param n - number of chars at which to separate lines
 * @param useSpaces - if true, attempt to insert newlines at whitespace
 * @param a - array used to build result, defaults to new array
 */
export declare function foldText(s: string, split?: string, n?: number, useSpaces?: boolean, a?: string[]): string;
export declare const fmapModules: (modules: IModuleDictionary) => {
    map: (handler: (m: IModule) => IModule) => IModuleDictionary;
};
export declare const fetchImage: (url: any) => Promise<{}>;
export declare const baseTypes: string[];
