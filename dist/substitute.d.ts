import { IExpression } from "./outline";
export declare const substituteAliases: (ast?: IExpression[]) => {
    newAST: IExpression[];
    errors: IError[];
};
export declare const substituteExtensions: (ast?: IExpression[]) => {
    newAST: IExpression[];
    errors: IError[];
};
export interface IError {
    message: string;
}
