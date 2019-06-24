import { IConfiguration, IModule } from "./helpers";
/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */
export declare class Project {
    projectDirectory: string;
    configPath: string;
    outPath: string;
    versionPath: string;
    preludePath: string;
    indexPath: string;
    config: IConfiguration;
    modules: IModule[];
    readonly errors: import("./outline").IError[][];
    constructor(projectDirectory: string);
    /**
     * Verify the directory and inspect if the directory is ready to
     * be used for the models.
     */
    verify(): Promise<Project>;
    init(template: any): Promise<Project>;
    compile(): Promise<Project>;
    watch(): Promise<void>;
    getCarFiles(): Promise<string[]>;
    watchCarFiles(): AsyncIterableIterator<any>;
    getModule(name: string): Promise<IModule | undefined>;
    getModules(): Promise<IModule[]>;
}
