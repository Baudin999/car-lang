import { IExpression } from "../outline";
export declare const createHTML: (ast: IExpression[], moduleName?: string | undefined) => string;
export interface ILookup {
    types: string[];
    enums: string[];
}
