import { readFile, writeFile } from "fs";
import { transpile, resolveImports, substitute, typeCheck, createAST } from "./transpiler";
import { createERD } from "./erd/createERD";
import * as program from "commander";
import { resolve, join } from "path";
import { exists } from "fs";
import { watch } from "chokidar";
import * as stringHash from "string-hash";
import { IExpression, IError } from "./outline";

function id(val) {
  return val;
}

program
  .version("0.0.1", "-v, --version")
  .option("-a", "Output the AST, default is true")
  .option("-c", "Output the CST, default is false")
  .option("-f, --file <s>", "The input file", id)
  .option("-i, --init", "Initialize the 'carconfig.json' file")
  .option("-p, --project <s>", "Specify the project directory, the 'carconfig.json' location")
  .option("-u, --uml", "Output the UML")
  .option("-o, --out <s>", "The output file", id)
  .option("-d, --deflate", "Output the deflated uml url")
  .parse(process.argv);

if (program.project) {
  // if we look at a project we'll want to the parse every file, then
  // include all the imports and do the rest...
  const projectDirectory = resolve(program.project);
  exists(join(projectDirectory, "carconfig.json"), (e: boolean) => {
    if (!e) {
      console.log(
        `ERROR: 'carconfig.json' does not exists. Please run ckc --init to initialize the project directory or manually create a carconfig.json`
      );
      process.exit(1);
    }

    let modules: IModuleDictionary = {};

    const watcher = watch(projectDirectory)
      .on("all", (event, fullPath: string) => {
        if (fullPath.endsWith(".car")) {
          let moduleName = fullPath
            .replace(projectDirectory, "")
            .replace(/\//g, ".")
            .replace(/^\./, "")
            .replace(/\.car/, "");

          readFile(fullPath, "utf8", (err, source: string) => {
            maybeRaiseError(err);
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
        }
      })
      .on("ready", () => {
        watcher.close();

        let moduleDictionary = typeCheck(substitute(resolveImports(modules)));

        for (let key in moduleDictionary) {
          if (moduleDictionary[key].errors && moduleDictionary[key].errors.length > 0) {
            console.log("Found errors in: " + key);
            console.log(JSON.stringify(moduleDictionary[key].errors, null, 4));
          }
        }
      });

    // we can now assume that the carconfig.json file exits (TODO: use zdragon.json in zdragon projects)
  });
}

if (program.file) {
  readFile(program.file, "utf8", (err, sourceCode) => {
    maybeRaiseError(err);

    const { errors, ast, tokens, cst } = transpile(sourceCode);

    if (errors && errors.length > 0) {
      console.log(JSON.stringify(errors, null, 4));
    } else if (program.uml) {
      console.log(createERD(ast));
    } else {
      console.log(JSON.stringify(ast, null, 4));
    }
    process.exit(0);
  });
}

if (program.init) {
  program.project = resolve(program.project || ".");
  const carconfigFile = join(program.project, "carconfig.json");
  const body = {
    version: "0.0.1",
    title: "The title",
    description: "The description"
  };
  writeFile(carconfigFile, JSON.stringify(body, null, 4), "utf8", (error: any) => {
    maybeRaiseError(error);
    process.exit(0);
  });
}

const maybeRaiseError = error => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
};

export interface IModule {
  name: string;
  ast: IExpression[];
  hash: string;
  errors: IError[];
  timestamp: Date;
}

export interface IModuleDictionary {
  [module: string]: IModule;
}
