import { IError, IExpression } from "./outline";
import { IModule, fetchImage } from "./helpers";
import { readFile } from "fs";
import { outputFile } from "fs-extra";
import { normalize, join } from "path";
import { createAST } from "./transpiler";
import * as stringHash from "string-hash";
import { IToken } from "chevrotain";
//@ts-ignore
import { generateURL } from "./deflate/deflate";
import { createERD } from "./erd/createERD";
import { createHTML } from "./html/createHTML";
import { createXSD } from "./xsd/createXSD";

export class Module implements IModule {
    name: string;
    path: string;
    hash: string;
    ast: IExpression[];
    tokens: IToken[];
    errors: IError[];
    timestamp: Date;

    // other fields
    projectDirectory: string;

    /**
     * Ceate/initialize a module.
     *
     * @param {string} projectDirectory The project directory from which we will manage this module.
     */
    constructor(projectDirectory: string) {
        // simple constructor
        this.projectDirectory = projectDirectory;
    }

    /**
     * Parse the module by passing in the full path
     * @param {string} fullPath The full path the file
     * @returns {Promise<Module>} The updated module
     */
    public parse(fullPath: string): Promise<Module> {
        return new Promise<Module>(resolve => {
            readFile(fullPath, "utf8", (error, source) => {
                const { ast, tokens } = createAST(source);
                this.hash = stringHash(source || "");
                this.ast = ast;
                this.path = normalize(fullPath);
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

    generateFullOutput(outPath: string): Promise<string> {
        return new Promise(resolve => {
            // Save the plantUML code to a .puml file
            const savePlantUML = (puml: string) => {
                const filePathPuml = join(outPath, this.name, this.name + ".puml");
                outputFile(filePathPuml, puml);
            };

            // Generate the SVG by going to the site and generating the svg
            const generateSVG = (puml: string) => {
                const url = generateURL(puml);
                fetchImage(url).then(img => {
                    const filePathSVG = join(outPath, this.name, this.name + ".svg");
                    outputFile(filePathSVG, img);
                });
            };

            // Create the entire ERD
            const puml = createERD(this.ast);
            if (puml) {
                savePlantUML(puml);
                generateSVG(puml);
            }

            // Generate the XSD file
            const xsd = createXSD(this.ast);
            const filePathXSD = join(outPath, this.name, this.name + ".xsd");
            outputFile(filePathXSD, xsd);

            // Generate the HTML file
            const html = createHTML(this.ast, puml ? this.name : undefined);
            const filePathHTML = join(outPath, this.name, this.name + ".html");
            outputFile(filePathHTML, html);

            resolve(puml);
            console.log("Compiled: ", this.name);
        });
    }
}

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
