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
    erdURL?: string;
}
export interface IModuleDictionary {
    [module: string]: IModule;
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
export declare const fetchImage: (url: any) => Promise<{}>;
export declare const baseTypes: string[];
export declare const baseTypeToXSDType: (b: string) => "xsd:string" | "xsd:integer" | "xsd:boolean" | "xsd:date" | "xsd:dateTime" | "xsd:time";
export declare const mapRestrictionToXSD: (baseType: string, restriction: IRestriction) => string;
