import { IModule } from "./helpers";
import { Module } from "./Module";
import { compile } from "./transpiler";
import { outputFile } from "fs-extra";

export class ModuleDictionary {
    private $: Record<string, Module>;

    constructor() {
        this.$ = {};
    }

    //modules = this.$;

    /**
     * Add a module to the module dictionary
     *
     * @param {IModule} module: The module
     */
    public addModule(module: Module) {
        this.$[module.name] = module;
    }

    /**
     * Returns if the dictionary contains the module.
     *
     * @param {string} name
     * @returns {boolean}
     */
    public hasModule(name: string): boolean {
        return !!this.$[name];
    }

    public isChanged(module: Module): boolean {
        let m = this.getModule(module.name);
        if (!m) return true;
        else {
            return m.hash !== module.hash;
        }
    }

    /**
     *
     * @param {string} name Get the module by the module name
     */
    public getModule(name: string): Module | null {
        return this.$[name];
    }

    public writeFiles(outPath: string) {
        this.map(module => {
            module.generateFullOutput(outPath);
            return module;
        });
    }

    public changeAndWrite(module: Module, outPath: string) {
        if (this.isChanged(module)) {
            module.generateFullOutput(outPath).then(s => {
                this.addModule(module);
            });
        }
    }

    public map(handler: HandlerType) {
        let newModuleDictionary: ModuleDictionary = new ModuleDictionary();
        for (var moduleKey in this.$) {
            let module = this.getModule(moduleKey);
            if (module) {
                newModuleDictionary.addModule(handler(module));
            }
        }
        return newModuleDictionary;
    }
}

type HandlerType = (m: Module) => Module;
