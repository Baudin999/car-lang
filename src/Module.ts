import { IError, IExpression } from "./outline";
import { IModule, fetchImage, IConfiguration } from "./helpers";
import { readFile } from "fs";
import { outputFile } from "fs-extra";
import { normalize, join } from "path";
import { createAST, transpile } from "./transpiler";
import * as stringHash from "string-hash";
import { IToken } from "chevrotain";
//@ts-ignore
import { generateURL } from "./deflate/deflate";
import { createERD } from "./erd/createERD";
import { createHTML } from "./html/createHTML";
import { createXSD } from "./xsd/createXSD";
import { createTS } from "./typescript/createTS";
import { createJsonSchema } from "./jsonSchema/createJsonSchema";

export class Module implements IModule {
  name: string;
  path: string;
  hash: string;
  ast: IExpression[];
  tokens: IToken[];
  errors: IError[];
  timestamp: Date;
  config?: IConfiguration;

  // other fields
  projectDirectory: string;

  /**
   * Ceate/initialize a module.
   *
   * @param {string} projectDirectory The project directory from which we will manage this module.
   */
  constructor(projectDirectory: string, configuration?: IConfiguration) {
    // simple constructor
    this.projectDirectory = projectDirectory;
    this.config = configuration;
  }

  /**
   * Parse the module by passing in the full path
   * @param {string} fullPath The full path the file
   * @returns {Promise<Module>} The updated module
   */
  public parse(fullPath: string): Promise<Module> {
    return new Promise<Module>(resolve => {
      readFile(fullPath, "utf8", (error, source) => {
        const { ast, errors, tokens } = transpile(source); //createAST(source);
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
        this.errors = errors;
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
      const xsd = createXSD(this.ast, this.config);
      const filePathXSD = join(outPath, this.name, this.name + ".xsd");
      outputFile(filePathXSD, xsd);

      // Generate the HTML file
      const html = createHTML(this.ast, puml ? this.name : undefined);
      const filePathHTML = join(outPath, this.name, this.name + ".html");
      outputFile(filePathHTML, html);

      const schemas = createJsonSchema(this.ast);
      schemas.map(schema => {
        const schemaPath = join(outPath, this.name, this.name + "_" + schema.name + ".json");
        outputFile(schemaPath, JSON.stringify(schema.schema, null, 4));
      });

      // Generate the TypeScript file
      const tsFileContent = createTS(this.ast);
      const tsPath = join(outPath, this.name, this.name + ".ts");
      outputFile(tsPath, tsFileContent);

      resolve(puml);
      console.log("Compiled: ", this.name);
    });
  }
}
