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
    parse(fullPath) {
        return new Promise(resolve => {
            fs_1.readFile(fullPath, "utf8", (error, source) => {
                const { ast, tokens } = transpiler_1.createAST(source);
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
                this.errors = [];
                this.tokens = tokens;
                resolve(this);
            });
        });
    }
    generateFullOutput(outPath) {
        return new Promise(resolve => {
            // Save the plantUML code to a .puml file
            const savePlantUML = (puml) => {
                const filePathPuml = path_1.join(outPath, this.name, this.name + ".puml");
                fs_extra_1.outputFile(filePathPuml, puml);
            };
            // Generate the SVG by going to the site and generating the svg
            const generateSVG = (puml) => {
                const url = deflate_1.generateURL(puml);
                helpers_1.fetchImage(url).then(img => {
                    const filePathSVG = path_1.join(outPath, this.name, this.name + ".svg");
                    fs_extra_1.outputFile(filePathSVG, img);
                });
            };
            // Create the entire ERD
            const puml = createERD_1.createERD(this.ast);
            if (puml) {
                savePlantUML(puml);
                generateSVG(puml);
            }
            // Generate the XSD file
            const xsd = createXSD_1.createXSD(this.ast, this.config);
            const filePathXSD = path_1.join(outPath, this.name, this.name + ".xsd");
            fs_extra_1.outputFile(filePathXSD, xsd);
            // Generate the HTML file
            const html = createHTML_1.createHTML(this.ast, puml ? this.name : undefined);
            const filePathHTML = path_1.join(outPath, this.name, this.name + ".html");
            fs_extra_1.outputFile(filePathHTML, html);
            resolve(puml);
            console.log("Compiled: ", this.name);
        });
    }
}
exports.Module = Module;
//# sourceMappingURL=Module.js.map