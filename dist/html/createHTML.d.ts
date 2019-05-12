import { IExpression } from "../outline";
export declare const createHTML: (ast: IExpression[], modulePath: string, svgs: any, moduleName?: string | undefined) => {
    html: any;
    svgs: any;
};
export interface ILookup {
    types: string[];
    enums: string[];
}
