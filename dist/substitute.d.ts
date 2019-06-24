import { IExpression, IError } from "./outline";
export declare const substituteAliases: (ast?: IExpression[]) => {
    ast: IExpression[];
    errors: IError[];
};
export declare const substitutePluckedFields: (ast?: IExpression[]) => {
    ast: IExpression[];
    errors: IError[];
};
export declare const substituteExtensions: (ast?: IExpression[]) => {
    ast: IExpression[];
    errors: IError[];
};
