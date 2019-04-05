import { IExpression } from "../outline";
export declare const createHTML: (ast: IExpression[], moduleName?: string | undefined) => any;
export interface ILookup {
    types: string[];
    enums: string[];
}
