import { IError, IExpression } from "./outline";
import { IModule, fetchImage, IConfiguration, readFileAsync } from "./helpers";
import { readFile, readFileSync } from "fs";
import { outputFile, remove } from "fs-extra";
import { normalize, join } from "path";
import { createAST } from "./transpiler";
import * as stringHash from "string-hash";
import { IToken } from "chevrotain";
//@ts-ignore
import { generateURL } from "./deflate/deflate";
import { createERD } from "./transformations/erd/createERD";
import { createHTML } from "./transformations/html/createHTML";
import { createXSD } from "./transformations/xsd/createXSD";
import { createTS } from "./transformations/typescript/createTS";
import { createJsonSchema } from "./transformations/jsonSchema/createJsonSchema";
import { substitutePluckedFields, substituteAliases, substituteExtensions } from "./substitute";
import { typeChecker } from "./tchecker";
import chalk from "chalk";
import { cliErrorMessageForModule } from "./ckc.errors";

let styles = readFileSync(join(__dirname + "/../src/assets/styles.css"), "utf8");

export class Module implements IModule {
  name: string;
  path: string;
  hash: string;
  ast: IExpression[];
  cst: any[];
  tokens: IToken[];
  errors: IError[];
  timestamp: Date;
  fullPath: string;
  source: string;
  // The output path of this module, use this to load the svgs and
  // other assets needed to avoid useless HTTP requests.
  outPath: string;
  htmlPath: string;
  config: IConfiguration;
  // a hash of stringHashes and urls
  svgs: any;

  // other fields
  projectDirectory: string;

  /**
   * Ceate/initialize a module.
   *
   * @param {string} projectDirectory The project directory from which we will manage this module.
   */
  constructor(projectDirectory: string, configuration: IConfiguration) {
    // simple constructor
    this.projectDirectory = projectDirectory;
    this.config = configuration;
  }

  async init(moduleName: string): Promise<IModule> {
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
      this.path = join(this.projectDirectory, this.config.outPath || ".out");
    } else {
      this.name = moduleName;
      this.fullPath = join(this.projectDirectory, this.name.replace(/\./g, "/") + ".car");
      this.path = join(this.projectDirectory, this.config.outPath || ".out");
    }

    this.outPath = join(this.path, ("v" + this.config.version).replace(/^vv/, "v"), this.name);
    this.htmlPath = join(this.outPath, this.name + ".html");
    try {
      this.svgs = await readFileAsync(join(this.outPath, "svgs.json"), true);
    } catch {
      this.svgs = {};
    }

    return new Promise<IModule>((resolve, reject) => {
      readFile(this.fullPath, "utf8", (err, source) => {
        if (err) {
          reject(
            `Could not initialize module "${this.name}" in directory ${this.projectDirectory}`
          );
        }
        this.source = source.trimRight();
        this.ast = [];
        this.cst = [];
        this.tokens = [];
        this.errors = [];
        resolve(this);
      });
    });
  }

  async update(source?: string): Promise<IModule> {
    if (source) {
      this.source = source.trimRight();
      return this;
    } else {
      return new Promise<IModule>((resolve, reject) => {
        readFile(this.fullPath, "utf8", (err, source) => {
          if (err) {
            reject(
              `Could not initialize module "${this.name}" in directory ${this.projectDirectory}`
            );
          }
          this.errors = [];
          this.source = source.trimRight();
          resolve(this);
        });
      });
    }
  }

  /**
   * Parse the module by passing in the full path
   * @param {string} fullPath The full path the file
   * @returns {Module} The updated module
   */
  parse(): IModule {
    let newHash = stringHash(this.source);
    if (newHash === this.hash) return this;

    // start processing the module
    let result;
    try {
      result = createAST(this.source);
    } catch (err) {
      console.log(err);
    }

    this.hash = newHash;
    this.timestamp = new Date();
    this.ast = !result.ast || !Array.isArray(result.ast) ? [] : result.ast;
    this.cst = result.cst || [];
    this.errors = result.errors || [];
    this.tokens = result.tokens || [];
    return this;
  }

  typeCheck(): IModule {
    let r0 = substitutePluckedFields(this.ast);
    let r1 = substituteAliases(r0.ast);
    let r2 = substituteExtensions(r1.ast);
    let errors = typeChecker(r2.ast);

    this.ast = r2.ast;
    this.errors = [...this.errors, ...r0.errors, ...r1.errors, ...r2.errors, ...errors];

    // now output the found errors
    if (this.errors && this.errors.length > 0) {
      console.log(chalk.red(`\nWe've found some errors in module "${this.name}"`));
      console.log(cliErrorMessageForModule(this));
    } else {
      console.log(`Perfectly parsed module ${this.name}`);
    }
    return this;
  }

  async link(modules: IModule[]): Promise<IModule> {
    return this;
  }

  writeDocumentation(): Promise<IModule> {
    return new Promise<IModule>((resolve, reject) => {
      // Save the actual plant UML which the tool outputs
      // this will help with the maintainability of the tool.
      const savePlantUML = (puml: string) => {
        const filePathPuml = join(this.outPath, this.name + ".puml");
        outputFile(filePathPuml, puml);
      };

      // Generate the SVG by going to the site and generating the svg
      const generateSVG = (puml: string) => {
        const url = generateURL(puml);
        fetchImage(url).then(img => {
          const filePathSVG = join(this.outPath, this.name + ".svg");
          outputFile(filePathSVG, img);
        });
      };

      // Create the entire ERD
      const puml = createERD(this.ast);
      const pumlHash = stringHash(puml).toString();
      const isChanged = !this.svgs.erd || this.svgs.erd !== pumlHash;
      if (puml && isChanged) {
        this.svgs.erd = pumlHash;
        savePlantUML(puml);
        generateSVG(puml);
      }

      // Generate the HTML files
      const { html, svgs } = createHTML(
        this.ast,
        this.outPath,
        this.svgs || {},
        puml ? this.name : undefined
      );
      const filePathHTML = join(this.outPath, this.name + ".html");
      outputFile(filePathHTML, html);
      const stylesPath = join(this.outPath, "styles.css");
      outputFile(stylesPath, styles);

      // DO SOMETHING WITH THE HASHES
      this.svgs = svgs;
      Object.keys(this.svgs).forEach(hash => {
        if (hash === "erd" || hash === "hashes") return;
        if (this.svgs.hashes.indexOf(hash) === -1) {
          remove(join(this.outPath, hash + ".svg"));
          delete this.svgs[hash];
        }
      });
      this.svgs.hashes = [];
      outputFile(join(this.outPath, "svgs.json"), JSON.stringify(this.svgs, null, 4));

      resolve(this);
    });
  }

  writeJSONSchema(): Promise<IModule> {
    return new Promise((resolve, reject) => {
      const schemas = createJsonSchema(this.ast);
      schemas.map(schema => {
        const schemaPath = join(this.outPath, schema.name + ".json");
        outputFile(schemaPath, JSON.stringify(schema.schema, null, 4));
      });
      resolve(this);
    });
  }

  writeXSD(): Promise<IModule> {
    return new Promise((resolve, reject) => {
      const xsd = createXSD(this.ast, this.config);
      const filePathXSD = join(this.outPath, this.name + ".xsd");
      outputFile(filePathXSD, xsd);
      resolve(this);
    });
  }

  writeTypeScript(): Promise<IModule> {
    return new Promise((resolve, reject) => {
      const tsFileContent = createTS(this.ast);
      const tsPath = join(this.outPath, this.name + ".ts");
      outputFile(tsPath, tsFileContent);
      resolve(this);
    });
  }

  toErd() {}

  // generateFullOutput(outPath: string): Promise<string> {
  //   return new Promise(resolve => {
  //     // the modulePath is the location all the assets of a module will
  //     // be saved to.
  //     let modulePath = join(outPath, this.name);

  //     // Save the plantUML code to a .puml file
  // const savePlantUML = (puml: string) => {
  //   const filePathPuml = join(modulePath, this.name + ".puml");
  //   outputFile(filePathPuml, puml);
  // };

  //     // Generate the XSD file

  //     //
  //     // JSON SCHEMAS
  //     //
  //     const schemas = createJsonSchema(this.ast);
  //     schemas.map(schema => {
  //       const schemaPath = join(modulePath, schema.name + ".json");
  //       outputFile(schemaPath, JSON.stringify(schema.schema, null, 4));
  //     });

  //     //
  //     // Generate the TypeScript file
  //     //
  //     const tsFileContent = createTS(this.ast);
  //     const tsPath = join(modulePath, this.name + ".ts");
  //     outputFile(tsPath, tsFileContent);

  //     resolve(puml);
  //     console.log("Compiled: ", this.name);
  //   });
  // }
}
