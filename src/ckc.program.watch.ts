import { resolve, join } from "path";
import { exists, readFile, existsSync } from "fs";
import { removeSync, outputFile } from "fs-extra";
import { watch } from "chokidar";
import * as stringHash from "string-hash";
import { IExpression, IError } from "./outline";
import { maybeRaiseError } from "./ckc";
import { compile, createAST } from "./transpiler";
import { createHTML } from "./html/createHTML";
import { createERD } from "./erd/createERD";
// @ts-ignore
import { generateURL } from "./deflate/deflate";
import { fetchImage } from "./helpers";
import { styleCSS } from "./ckc";

let modules: IModuleDictionary;

export const watchProgram = projectName => {
  const projectDirectory = resolve(projectName);
  exists(join(projectDirectory, "carconfig.json"), (e: boolean) => {
    if (!e) {
      console.log(
        `ERROR: 'carconfig.json' does not exists. Please run ckc --init to initialize the project directory or manually create a carconfig.json`
      );
      process.exit(1);
    }
    let isReady = false;
    modules = {};
    const watcher = watch(projectDirectory, {ignored: join(projectDirectory, ".out") })
      .on("all", (event:string, fullPath: string) => {
        // (event === "add" || event === "change") && 
        if (fullPath.endsWith(".car")) {
            let moduleName = fullPath
              .replace(projectDirectory, "")
              .replace(/\//g, ".")
              .replace(/^\./, "")
              .replace(/\.car/, "");

            readFile(fullPath, "utf8", (err, source: string) => {
              maybeRaiseError(err);
              if (err) return;

              const hash = stringHash(source);
              const { ast } = createAST(source);
              console.log(`Finished compiling: ${moduleName}`);
              modules[moduleName] = {
                name: moduleName,
                ast,
                errors: [],
                hash,
                timestamp: new Date()
              };
            });

            // if (modules[moduleName]) {
            //   parseModule(projectDirectory, modules[moduleName]);
            // }
            if (isReady) {
              parseModules(projectDirectory, modules);
            }
          }
      })
      .on("ready", () => {
        parseModules(projectDirectory, modules);
        isReady = true;
      });
  });
};

const parseModule = (projectDirectory: string, module:IModule) => {
  // Check if the outpath exists and if so clean it.
  const outPath = join(projectDirectory, ".out");
  // the root module path
  const modulePath = join(outPath, module.name);

  // we'll clear all the output of the module
  if (existsSync(modulePath)) {
    removeSync(modulePath);
  }

  // Save the plant UML file to the directory. And generate a 
  // svg which we can also save to the directory
  const puml = createERD(module.ast);
  if (puml) {
    const filePathPuml = join(modulePath, module.name + ".puml");
    outputFile(filePathPuml, puml);

    const url = generateURL(puml);
    modules[module.name].erdURL = url;
    fetchImage(url).then(img => {
      const filePathSVG = join(modulePath, module.name + ".svg");
      outputFile(filePathSVG, img);
    });

  }

  // Generate the HTML and save it to the directory
  const html = createHTML(module.ast, puml ? module.name : undefined);
  const filePath = join(modulePath, module.name + ".html");
  outputFile(filePath, html);
}

const parseModules = (projectDirectory: string, modules:IModuleDictionary) => {
  let hasErrors = false;
  let moduleDictionary = compile(modules);
  for (let key in moduleDictionary) {
    if (moduleDictionary[key].errors && moduleDictionary[key].errors.length > 0) {
      hasErrors = true;
      console.log("Found errors in: " + key);
      console.log(JSON.stringify(moduleDictionary[key].errors, null, 4));
    }
  }

  // Can't continue if there are errors...
  if (hasErrors) {
    console.log("Quitting the process because I've found errors.")
    return;
  }

  // Check if the outpath exists and if so clean it.
  const outPath = join(projectDirectory, ".out");
  if (existsSync(outPath)) {
    removeSync(outPath);
  }

  const stylePath = join(outPath, "style.css");
  outputFile(stylePath, styleCSS);

  for (let key in moduleDictionary) {
    // Get the module.
    let module: IModule = moduleDictionary[key];

    // Save the plant UML file to the directory. And generate a 
    // svg which we can also save to the directory
    const puml = createERD(module.ast);
    if (puml) {
      const filePathPuml = join(outPath, module.name, module.name + ".puml");
      outputFile(filePathPuml, puml);

      const url = generateURL(puml);
      fetchImage(url).then(img => {
        const filePathSVG = join(outPath, module.name, module.name + ".svg");
        outputFile(filePathSVG, img);
      });
    }

    // Generate the HTML and save it to the directory
    const html = createHTML(module.ast, puml ? module.name : undefined);
    const filePath = join(outPath, module.name, module.name + ".html");
    outputFile(filePath, html);
  }
}

export interface IModule {
  name: string;
  ast: IExpression[];
  hash: string;
  errors: IError[];
  timestamp: Date;
  erdURL?: string;
}

export interface IModuleDictionary {
  [module: string]: IModule;
}

