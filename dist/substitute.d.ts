import { IExpression, IError } from "./outline";
export declare const substituteAliases: (ast?: IExpression[]) => {
    newAST: IExpression[];
    errors: IError[];
};
export declare const substitutePluckedFields: (ast?: IExpression[]) => {
    newAST: IExpression[];
    errors: IError[];
};
export declare const substituteExtensions: (ast?: IExpression[]) => {
    newAST: IExpression[];
    errors: IError[];
};
