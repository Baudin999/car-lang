import { IExpression, IError } from "./outline";
import { IToken } from "chevrotain";
import { IModuleDictionary } from "./ckc";
export declare const transpile: (source: string) => ITranspilationResult;
export declare const createAST: (source: string) => {
    ast: any;
    tokens: IToken[];
    cst: any;
};
export declare const resolveImports: (modules: IModuleDictionary) => IModuleDictionary;
export declare const extensions: (modules: IModuleDictionary) => IModuleDictionary;
export declare const pluck: (modules: IModuleDictionary) => IModuleDictionary;
export declare const resolveAlias: (modules: IModuleDictionary) => IModuleDictionary;
export declare const typeCheck: (modules: IModuleDictionary) => IModuleDictionary;
export declare const compile: (modules: IModuleDictionary) => IModuleDictionary;
export interface ITranspilationResult {
    tokens: IToken[];
    cst: any[];
    ast: IExpression[];
    errors: IError[];
}
