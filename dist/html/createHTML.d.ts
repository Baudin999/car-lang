import { IExpression } from "../outline";
export declare const createHTML: (ast: IExpression[]) => string;
export interface ILookup {
    types: string[];
    enums: string[];
}
