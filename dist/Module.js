"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
const transpiler_1 = require("./transpiler");
const stringHash = require("string-hash");
class Module {
    /**
     * Ceate/initialize a module.
     *
     * @param {string} projectDirectory The project directory from which we will manage this module.
     */
    constructor(projectDirectory, configuration) {
        // simple constructor
        this.projectDirectory = projectDirectory;
        this.config = configuration;
    }
    init(moduleName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // we can init through the module name or through the
            // fullPath of a module
            if (moduleName.endsWith(".car")) {
                this.fullPath = moduleName;
                this.name = moduleName
                    .replace(this.projectDirectory, "")
                    .replace(/\//g, ".")
                    .replace(/\\/g, ".")
                    .replace(/\.car/, "")
                    .replace(/^\./, "");
            }
            else {
                this.name = moduleName;
                this.fullPath = path_1.join(this.projectDirectory, this.name.replace(/\./g, "/") + ".car");
            }
            this.path = path_1.normalize(this.fullPath);
            this.outPath = path_1.join(this.config.version, this.name);
            return new Promise((resolve, reject) => {
                fs_1.readFile(this.fullPath, "utf8", (err, source) => {
                    if (err) {
                        reject(`Could not initialize module "${this.name}" in directory ${this.projectDirectory}`);
                    }
                    this.source = source.trimRight();
                    resolve(this);
                });
            });
        });
    }
    update(source) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (source) {
                this.source = source.trimRight();
                return this;
            }
            else {
                return new Promise((resolve, reject) => {
                    fs_1.readFile(this.fullPath, "utf8", (err, source) => {
                        if (err) {
                            reject(`Could not initialize module "${this.name}" in directory ${this.projectDirectory}`);
                        }
                        this.errors = [];
                        this.source = source.trimRight();
                        resolve(this);
                    });
                });
            }
        });
    }
    /**
     * Parse the module by passing in the full path
     * @param {string} fullPath The full path the file
     * @returns {Module} The updated module
     */
    parse() {
        let newHash = stringHash(this.source);
        if (newHash === this.hash)
            return this;
        // start processing the module
        let result;
        try {
            result = transpiler_1.createAST(this.source);
        }
        catch (err) {
            console.log(err);
        }
        this.hash = newHash;
        this.timestamp = new Date();
        this.ast = result.ast;
        this.cst = result.cst;
        this.errors = result.errors || [];
        this.tokens = result.tokens;
        return this;
    }
    link(modules) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this;
        });
    }
    toErd() { }
}
exports.Module = Module;
//# sourceMappingURL=Module.js.map