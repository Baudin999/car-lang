import { IError, IExpression } from "./outline";
import { IModule, IConfiguration } from "./helpers";
import { IToken } from "chevrotain";
export declare class Module implements IModule {
    name: string;
    path: string;
    hash: string;
    ast: IExpression[];
    tokens: IToken[];
    errors: IError[];
    timestamp: Date;
    config?: IConfiguration;
    svgs: any;
    projectDirectory: string;
    /**
     * Ceate/initialize a module.
     *
     * @param {string} projectDirectory The project directory from which we will manage this module.
     */
    constructor(projectDirectory: string, configuration?: IConfiguration);
    /**
     * Parse the module by passing in the full path
     * @param {string} fullPath The full path the file
     * @returns {Promise<Module>} The updated module
     */
    parse(fullPath: string): Promise<Module>;
    generateFullOutput(outPath: string): Promise<string>;
}
