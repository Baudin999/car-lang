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
class Module {
    /**
     * Ceate/initialize a module.
     *
     * @param {string} projectDirectory The project directory from which we will manage this module.
     */
    constructor(projectDirectory) {
        // simple constructor
        this.projectDirectory = projectDirectory;
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
            const savePlantUML = (puml) => {
                const filePathPuml = path_1.join(outPath, this.name, this.name + ".puml");
                fs_extra_1.outputFile(filePathPuml, puml);
            };
            const generateSVG = (puml) => {
                const url = deflate_1.generateURL(puml);
                helpers_1.fetchImage(url).then(img => {
                    const filePathSVG = path_1.join(outPath, this.name, this.name + ".svg");
                    fs_extra_1.outputFile(filePathSVG, img);
                });
            };
            const puml = createERD_1.createERD(this.ast);
            if (puml) {
                savePlantUML(puml);
                generateSVG(puml);
            }
            const html = createHTML_1.createHTML(this.ast, puml ? this.name : undefined);
            const filePath = path_1.join(outPath, this.name, this.name + ".html");
            fs_extra_1.outputFile(filePath, html);
            resolve(puml);
            console.log("Compiled: ", this.name);
        });
    }
}
exports.Module = Module;
/*

export const generateUML = (module: IModule, outPath: string): string => {
    const savePlantUML = (module: IModule, outPath: string, puml: string) => {
        const filePathPuml = join(outPath, module.name, module.name + ".puml");
        outputFile(filePathPuml, puml);
    };

    const generateSVG = (module: IModule, outPath: string, puml: string) => {
        const url = generateURL(puml);
        fetchImage(url).then(img => {
            const filePathSVG = join(outPath, module.name, module.name + ".svg");
            outputFile(filePathSVG, img);
        });
    };

    const puml = createERD(module.ast);
    if (puml) {
        savePlantUML(module, outPath, puml);
        generateSVG(module, outPath, puml);
    }

    return puml;
};

export const generateAST = (module: IModule, outPath: string): IExpression[] => {
    const astFilePath = join(outPath, module.name, module.name + ".json");
    outputFile(astFilePath, JSON.stringify(module.ast, null, 4));

    return module.ast;
};

export const generateXSD = (module: IModule, outPath: string): string => {
    const xsd = createXSD(module.ast);
    const xsdFilePath = join(outPath, module.name, module.name + ".xsd");
    outputFile(xsdFilePath, xsd);

    return xsd;
};

export const generateHTML = (module: IModule, puml: string, outPath: string): string => {
    const html = createHTML(module.ast, puml ? module.name : undefined);
    const filePath = join(outPath, module.name, module.name + ".html");
    outputFile(filePath, html);

    return html;
};


*/
//# sourceMappingURL=Module.js.map