import { IConfiguration, IModule } from "./helpers";
/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */
export declare class Project {
    projectDirectory: string;
    useRelativePaths: boolean;
    configPath: string;
    outPath: string;
    versionPath: string;
    preludePath: string;
    indexPath: string;
    isRelease: boolean;
    config: IConfiguration;
    modules: IModule[];
    readonly errors: import("./outline").IError[][];
    constructor(projectDirectory: string, useRelativePaths?: boolean, isRelease?: boolean);
    /**
     * Verify the directory and inspect if the directory is ready to
     * be used for the models.
     */
    verify(): Promise<Project>;
    init(template: any): Promise<Project>;
    compile(ignore?: boolean): Promise<Project>;
    watch(): Promise<void>;
    writeIndexFile(): Promise<Project>;
    getCarFiles(): Promise<string[]>;
    watchCarFiles(): AsyncIterableIterator<any>;
    getModule(name: string): Promise<IModule>;
    getModules(): Promise<IModule[]>;
    clean(): Promise<Project>;
}
