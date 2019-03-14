import { IExpression } from "./outline";
export declare const typeChecker: (ast?: IExpression[]) => IError[];
export interface IError {
    message: string;
}
