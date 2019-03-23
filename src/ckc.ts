import { readFile, writeFile } from "fs";
import { transpile, compile } from "./transpiler";
import { createERD } from "./erd/createERD";
import * as program from "commander";
import { resolve, join } from "path";
import { runProgram } from "./ckc.program";
import { watchProgram } from "./ckc.program.watch";
import { IExpression, IError } from "./outline";
import { init } from "./ckc.init";

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
  .option("-w, --watch", "Watch for file changes, can only be used together with the <project> flag.")
  .option("-d, --deflate", "Output the deflated uml url")
  .parse(process.argv);


if (program.project && program.watch) {
  // we'll watch the file system on save...
  watchProgram(program.project);
}
else if (program.project) {
  // if we look at a project we'll want to the parse every file, then
  // include all the imports and do the rest...
  runProgram(program.project);
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
  init(program.project);
}

export const maybeRaiseError = error => {
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
