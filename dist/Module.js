"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const transpiler_1 = require("./transpiler");
const stringHash = require("string-hash");
//@ts-ignore
const deflate_1 = require("./deflate/deflate");
const createERD_1 = require("./erd/createERD");
const createHTML_1 = require("./html/createHTML");
const createXSD_1 = require("./xsd/createXSD");
const createTS_1 = require("./typescript/createTS");
const createJsonSchema_1 = require("./jsonSchema/createJsonSchema");
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
    /**
     * Parse the module by passing in the full path
     * @param {string} fullPath The full path the file
     * @returns {Promise<Module>} The updated module
     */
    parse(fullPath, versionPath) {
        return new Promise(resolve => {
            fs_1.readFile(fullPath, "utf8", (error, source) => {
                const { ast, errors, tokens } = transpiler_1.transpile(source); //createAST(source);
                this.hash = stringHash(source || "");
                this.ast = ast;
                this.path = path_1.normalize(fullPath);
                this.name = fullPath
                    .replace(this.projectDirectory, "")
                    .replace(/\//g, ".")
                    .replace(/\\/g, ".")
                    .replace(/\.car/, "")
                    .replace(/^\./, "");
                this.timestamp = new Date();
                this.errors = errors;
                this.tokens = tokens;
                this.outPath = path_1.join(versionPath, this.name);
                fs_1.readFile(path_1.join(this.outPath, "svgs.json"), "utf8", (error2, svgsJSON) => {
                    if (!error2) {
                        this.svgs = JSON.parse(svgsJSON);
                    }
                    else {
                        this.svgs = {};
                    }
                    resolve(this);
                });
            });
        });
    }
    generateFullOutput(outPath) {
        return new Promise(resolve => {
            // the modulePath is the location all the assets of a module will
            // be saved to.
            let modulePath = path_1.join(outPath, this.name);
            // Save the plantUML code to a .puml file
            const savePlantUML = (puml) => {
                const filePathPuml = path_1.join(modulePath, this.name + ".puml");
                fs_extra_1.outputFile(filePathPuml, puml);
            };
            // Generate the SVG by going to the site and generating the svg
            const generateSVG = (puml) => {
                const url = deflate_1.generateURL(puml);
                helpers_1.fetchImage(url).then(img => {
                    const filePathSVG = path_1.join(modulePath, this.name + ".svg");
                    fs_extra_1.outputFile(filePathSVG, img);
                });
            };
            // Create the entire ERD
            const puml = createERD_1.createERD(this.ast);
            const pumlHash = stringHash(puml).toString();
            const isChanged = !this.svgs.erd || this.svgs.erd !== pumlHash;
            if (puml && isChanged) {
                this.svgs.erd = pumlHash;
                savePlantUML(puml);
                generateSVG(puml);
            }
            // Generate the XSD file
            const xsd = createXSD_1.createXSD(this.ast, this.config);
            const filePathXSD = path_1.join(modulePath, this.name + ".xsd");
            fs_extra_1.outputFile(filePathXSD, xsd);
            //
            // Generate the HTML file
            //
            const { html, svgs } = createHTML_1.createHTML(this.ast, modulePath, this.svgs || {}, puml ? this.name : undefined);
            const filePathHTML = path_1.join(modulePath, this.name + ".html");
            fs_extra_1.outputFile(filePathHTML, html);
            //
            // DO SOMETHING WITH THE HASHES
            //
            this.svgs = Object.assign({}, svgs);
            Object.keys(this.svgs).forEach(hash => {
                if (hash === "erd" || hash === "hashes")
                    return;
                if (this.svgs.hashes.indexOf(hash) === -1) {
                    fs_extra_1.remove(path_1.join(modulePath, hash + ".svg"));
                    delete this.svgs[hash];
                }
            });
            fs_extra_1.outputFile(path_1.join(modulePath, "svgs.json"), JSON.stringify(svgs, null, 4));
            //
            // JSON SCHEMAS
            //
            const schemas = createJsonSchema_1.createJsonSchema(this.ast);
            schemas.map(schema => {
                const schemaPath = path_1.join(modulePath, this.name + "_" + schema.name + ".json");
                fs_extra_1.outputFile(schemaPath, JSON.stringify(schema.schema, null, 4));
            });
            //
            // Generate the TypeScript file
            //
            const tsFileContent = createTS_1.createTS(this.ast);
            const tsPath = path_1.join(modulePath, this.name + ".ts");
            fs_extra_1.outputFile(tsPath, tsFileContent);
            resolve(puml);
            console.log("Compiled: ", this.name);
        });
    }
}
exports.Module = Module;
//# sourceMappingURL=Module.js.map