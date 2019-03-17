import { resolve, join } from "path";
import { exists, readFile } from "fs";
import { watch } from "chokidar";
import * as stringHash from "string-hash";
import { IExpression, IError } from "./outline";
import { maybeRaiseError } from "./ckc";
import { transpile, resolveImports, substitute, typeCheck, createAST } from "./transpiler";

export const runProgram = projectName => {
  const projectDirectory = resolve(projectName);
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
  });
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
