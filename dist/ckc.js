"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const transpiler_1 = require("./transpiler");
const createERD_1 = require("./erd/createERD");
const program = require("commander");
const path_1 = require("path");
const fs_2 = require("fs");
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
    const projectDirectory = path_1.resolve(program.project);
    fs_2.exists(path_1.join(projectDirectory, "carconfig.json"), (e) => {
        if (!e) {
            console.log(`ERROR: 'carconfig.json' does not exists. Please run ckc --init to initialize the project directory or manually create a carconfig.json`);
            process.exit(1);
        }
        // we can now assume that the carconfig.json file exits (TODO: use zdragon.json in zdragon projects)
    });
}
if (program.file) {
    fs_1.readFile(program.file, "utf8", (err, sourceCode) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        const { errors, ast, tokens, cst } = transpiler_1.transpile(sourceCode);
        if (errors && errors.length > 0) {
            console.log(JSON.stringify(errors, null, 4));
        }
        else if (program.uml) {
            console.log(createERD_1.createERD(ast));
        }
        else {
            console.log(JSON.stringify(ast, null, 4));
        }
        process.exit(0);
    });
}
if (program.init) {
    program.project = path_1.resolve(program.project || ".");
    const carconfigFile = path_1.join(program.project, "carconfig.json");
    const body = {
        version: "0.0.1",
        title: "The title",
        description: "The description"
    };
    fs_1.writeFile(carconfigFile, JSON.stringify(body, null, 4), "utf8", (error) => {
        if (error) {
            console.log(error);
        }
        process.exit(error ? 1 : 0);
    });
}
//# sourceMappingURL=ckc.js.map