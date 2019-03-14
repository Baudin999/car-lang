import { IExpression } from "./../outline";
export declare const createERD: (ast: IExpression[]) => string;
export interface ILookup {
    types: string[];
    enums: string[];
}
