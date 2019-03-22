import { resolve, join } from "path";
import { exists, readFile, existsSync } from "fs";
import { removeSync, outputFile } from "fs-extra";
import { watch } from "chokidar";
import * as stringHash from "string-hash";
import { IExpression, IError } from "./outline";
import { maybeRaiseError } from "./ckc";
import { transpile, resolveImports, substitute, typeCheck, pluck, createAST } from "./transpiler";
import { createHTML } from "./html/createHTML";
import { createERD } from "./erd/createERD";
// @ts-ignore
import { generateURL } from "./deflate/deflate";
import { fetchImage } from "./helpers";

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
        let hasErrors = false;
        let moduleDictionary = typeCheck(substitute(pluck(resolveImports(modules))));
        for (let key in moduleDictionary) {
          if (moduleDictionary[key].errors && moduleDictionary[key].errors.length > 0) {
            hasErrors = true;
            console.log("Found errors in: " + key);
            console.log(JSON.stringify(moduleDictionary[key].errors, null, 4));
          }
        }

        // Can't continue if there are errors...
        if (hasErrors) return;

        // Check if the outpath exists and if so clean it.
        const outPath = join(projectDirectory, ".out");
        if (existsSync(outPath)) {
          removeSync(outPath);
        }

        const stylePath = join(outPath, "style.css");
        outputFile(stylePath, styleCSS);

        for (let key in moduleDictionary) {
          // Don't do sub directories yet...
          // TODO: check to see to which Domain the sub-module belongs
          //       create a sub-directory in that domain and generate
          //       the relevant stuff in that sub-folder.
          if (key.indexOf(".") > -1) return;

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



const styleCSS = `

/* RESET */

*, *:before, *:after {
  box-sizing: border-box;
}

html, body {
  font-family: 'Roboto', 'Verdana', sans-serif;
}


table, table tr, table tr td, tr table th {
    border: none;
    border-width: 0px;
    border-image-width: 0px;
    padding: 0;
    margin: 0;
    outline: none;
    border-collapse: collapse;
}

/* TABEL STYLES */
table {
    width: 100%;
    margin: 1rem;
    border: 1px solid lightgray;
}

table tr:nth-child(even){background-color: #f2f2f2;}
  
table tr:hover {background-color: #ddd;}
  
table th {
    text-align: left;
    background-color: maroon;
    color: white;
}
`;