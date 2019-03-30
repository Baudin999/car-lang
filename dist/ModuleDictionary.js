"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ModuleDictionary {
    constructor() {
        this.$ = {};
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
    }
    changeAndWrite(module, outPath) {
        if (this.isChanged(module)) {
            module.generateFullOutput(outPath).then(s => {
                this.addModule(module);
            });
        }
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