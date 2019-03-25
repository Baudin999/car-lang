import { IExpression, IView } from "./../outline";
export declare const createERD: (ast: IExpression[], title?: string | undefined, depth?: number) => string;
export declare const createView: (view: IView, ast: IExpression[]) => string;
export interface ILookup {
    types: string[];
    enums: string[];
    data: string[];
}
