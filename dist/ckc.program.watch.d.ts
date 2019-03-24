import { IExpression, IError } from "./outline";
export declare const watchProgram: (projectName: any) => void;
export interface IModule {
    name: string;
    ast: IExpression[];
    hash: string;
    errors: IError[];
    timestamp: Date;
    erdURL?: string;
}
export interface IModuleDictionary {
    [module: string]: IModule;
}
