import { IError, IExpression } from "./outline";
import { IModule, IConfiguration } from "./helpers";
import { IToken } from "chevrotain";
export declare class Module implements IModule {
    name: string;
    path: string;
    hash: string;
    ast: IExpression[];
    cst: any[];
    tokens: IToken[];
    errors: IError[];
    timestamp: Date;
    fullPath: string;
    source: string;
    outPath: string;
    htmlPath: string;
    config: IConfiguration;
    svgs: any;
    projectDirectory: string;
    /**
     * Ceate/initialize a module.
     *
     * @param {string} projectDirectory The project directory from which we will manage this module.
     */
    constructor(projectDirectory: string, configuration: IConfiguration);
    init(moduleName: string): Promise<IModule>;
    update(source?: string): Promise<IModule>;
    /**
     * Parse the module by passing in the full path
     * @param {string} fullPath The full path the file
     * @returns {Module} The updated module
     */
    parse(): IModule;
    typeCheck(): IModule;
    link(modules: IModule[]): Promise<IModule>;
    writeDocumentation(): Promise<IModule>;
    writeJSONSchema(): Promise<IModule>;
    writeXSD(): Promise<IModule>;
    writeTypeScript(): Promise<IModule>;
    toErd(): void;
}
