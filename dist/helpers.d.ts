import { IRestriction, IExpression, IError } from "./outline";
import { IToken } from "chevrotain";
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
export interface IModule {
    /**
     * The Name pf the module something like:
     * Prelude
     * Services.Customer
     */
    name: string;
    /**
     * The path on the file system where we can find the actual file.
     */
    path: string;
    /**
     * The hash of the source, this is used so that we can skip the
     * compilation if the hash is not different.
     */
    hash: string;
    /**
     * The actual AST the source code transpiles to.
     */
    ast: IExpression[];
    /**
     * The CST as outputted by the chevrotain parser.
     */
    cst: any[];
    /**
     * The actual AST the source code transpiles to.
     */
    tokens: IToken[];
    /**
     * Transpilation and type checking errors
     */
    errors: IError[];
    /**
     * Last compile run date/time.
     */
    timestamp: Date;
    /**
     * The ERD URL
     */
    erdURL?: string;
    fullPath: string;
    source: string;
    outPath: string;
    config: IConfiguration;
    parse: () => IModule;
    link: (modules: IModule[]) => Promise<IModule>;
    update: (source?: string) => Promise<IModule>;
}
export interface IModuleDictionary {
    [module: string]: IModule;
}
export declare const flatten: <T>(items: T[]) => T[];
export declare const purge: <T>(items: T[]) => T[];
export declare const clone: (source: any, template?: any) => any;
export declare const readFileAsync: (filePath: any, parse: any) => Promise<{}>;
/**
 * Fold a long line and intersperse with newlines at certain intervals
 * @param s - input string
 * @param n - number of chars at which to separate lines
 * @param useSpaces - if true, attempt to insert newlines at whitespace
 * @param a - array used to build result, defaults to new array
 */
export declare function foldText(s: string, n?: number, split?: string, useSpaces?: boolean, a?: string[]): string;
export declare const fetchImage: (url: any) => Promise<{}>;
export declare const baseTypes: string[];
export declare const baseTypeToXSDType: (b: string) => string;
export declare const mapRestrictionToXSD: (baseType: string, restriction: IRestriction) => string;
export declare const last: <T>(array: T[]) => T;
export declare const splitFrom: <T>(array: T[], index: number) => {
    start: T[];
    end: T[];
};
export declare const splitFromLast: <T>(array: T[]) => {
    items: T[];
    last: T;
};
export declare const baseTypeToJSONType: (b: string) => string | null;
export declare const baseTypeToTypeScriptType: (b: string) => string | null;
export interface IConfiguration {
    name: string;
    version: string;
    xsd: {
        namespace: string;
    };
    json: {
        namespace: string;
    };
    outPath?: string;
}
