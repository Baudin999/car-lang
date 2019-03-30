import { IExpression, IError } from "./outline";
import { IToken } from "chevrotain";
import { ModuleDictionary } from "./ModuleDictionary";
export declare const transpile: (source: string) => ITranspilationResult;
export declare const createAST: (source: string) => {
    ast: any;
    tokens: IToken[];
    cst: any;
};
export declare const resolveImports: (modules: ModuleDictionary) => ModuleDictionary;
export declare const extensions: (modules: ModuleDictionary) => ModuleDictionary;
export declare const pluck: (modules: ModuleDictionary) => ModuleDictionary;
export declare const resolveAlias: (modules: ModuleDictionary) => ModuleDictionary;
export declare const typeCheck: (modules: ModuleDictionary) => ModuleDictionary;
export declare const compile: (modules: ModuleDictionary) => ModuleDictionary;
export interface ITranspilationResult {
    tokens: IToken[];
    cst: any[];
    ast: IExpression[];
    errors: IError[];
}
