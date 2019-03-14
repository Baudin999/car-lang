import { IExpression } from "./outline";
import { IError } from "./tchecker";
import { IToken } from "chevrotain";
export declare const transpile: (source: string) => ITranspilationResult;
export interface ITranspilationResult {
    tokens: IToken[];
    cst: any[];
    ast: IExpression[];
    errors: IError[];
}
