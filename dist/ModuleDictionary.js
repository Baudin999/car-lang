"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
class ModuleDictionary {
    constructor(config) {
        this.$ = {};
        this.config = config;
    }
    //modules = this.$;
    /**
     * Add a module to the module dictionary
     *
     * @param {IModule} module: The module
     */
    addModule(module) {
        this.$[module.name] = module;
    }
    /**
     * Returns if the dictionary contains the module.
     *
     * @param {string} name
     * @returns {boolean}
     */
    hasModule(name) {
        return !!this.$[name];
    }
    isChanged(module) {
        let m = this.getModule(module.name);
        if (!m)
            return true;
        else {
            return m.hash !== module.hash;
        }
    }
    /**
     *
     * @param {string} name Get the module by the module name
     */
    getModule(name) {
        return this.$[name];
    }
    writeFiles(outPath) {
        this.map(module => {
            module.generateFullOutput(outPath);
            return module;
        });
        this.writeOverviewPage(outPath);
    }
    changeAndWrite(module, outPath) {
        if (this.isChanged(module)) {
            module.generateFullOutput(outPath).then(s => {
                this.addModule(module);
            });
            this.writeOverviewPage(outPath);
        }
    }
    writeOverviewPage(outPath) {
        const pages = [];
        for (var name in this.$) {
            let pagePath = path_1.join(outPath, name, name + ".html");
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
        const indexPath = path_1.join(outPath, "index.html");
        fs_extra_1.outputFile(indexPath, html);
    }
    map(handler) {
        let newModuleDictionary = new ModuleDictionary();
        for (var moduleKey in this.$) {
            let module = this.getModule(moduleKey);
            if (module) {
                newModuleDictionary.addModule(handler(module));
            }
        }
        return newModuleDictionary;
    }
}
exports.ModuleDictionary = ModuleDictionary;
//# sourceMappingURL=ModuleDictionary.js.map