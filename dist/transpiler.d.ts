import { IExpression, IError } from "./outline";
import { IToken } from "chevrotain";
import { IModule } from "./helpers";
export declare const createAST: (source: string) => {
    ast: {};
    tokens: never[];
    cst: never[];
    errors?: undefined;
} | {
    ast: any;
    tokens: IToken[];
    cst: any;
    errors: IError[];
};
export declare const resolveImports: (modules: IModule[]) => IModule[];
export interface ITranspilationResult {
    tokens: IToken[];
    cst: any[];
    ast: IExpression[];
    errors: IError[];
}
