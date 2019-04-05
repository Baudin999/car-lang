import { IConfiguration } from "./helpers";
import { Module } from "./Module";
export declare class ModuleDictionary {
    private $;
    private config?;
    constructor(config?: IConfiguration);
    /**
     * Add a module to the module dictionary
     *
     * @param {IModule} module: The module
     */
    addModule(module: Module): void;
    /**
     * Returns if the dictionary contains the module.
     *
     * @param {string} name
     * @returns {boolean}
     */
    hasModule(name: string): boolean;
    isChanged(module: Module): boolean;
    /**
     *
     * @param {string} name Get the module by the module name
     */
    getModule(name: string): Module | null;
    writeFiles(outPath: string): void;
    changeAndWrite(module: Module, outPath: string): void;
    writeOverviewPage(outPath: string): void;
    map(handler: HandlerType): ModuleDictionary;
}
declare type HandlerType = (m: Module) => Module;
export {};
