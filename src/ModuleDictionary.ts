import { IConfiguration } from "./helpers";
import { Module } from "./Module";
import { outputFile } from "fs-extra";
import { join } from "path";

export class ModuleDictionary {
    private $: Record<string, Module>;
    private config?: IConfiguration;

    constructor(config?: IConfiguration) {
        this.$ = {};
        this.config = config;
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
        this.writeOverviewPage(outPath);
    }

    public changeAndWrite(module: Module, outPath: string) {
        if (this.isChanged(module)) {
            module.generateFullOutput(outPath).then(s => {
                this.addModule(module);
            });
            this.writeOverviewPage(outPath);
        }
    }

    public writeOverviewPage(outPath: string) {
        const pages: string[] = [];
        for (var name in this.$) {
            let pagePath = join(outPath, name, name + ".html");
            pages.push(`<li><a href="${pagePath}">${name}</a></li>`);
        }
        pages.sort();

        // write the overview page
        const html = `
<html>
  <head>
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
    <link rel="stylesheet" href="./../style.css">
  </head>
  <body>
    <ul>
        ${pages.join("\n")}
    </ul>
  </body>
</html>        
        `;
        const indexPath = join(outPath, "index.html");
        outputFile(indexPath, html);
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
