"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const transpiler_1 = require("./transpiler");
const createERD_1 = require("./erd/createERD");
const program = require("commander");
const ckc_program_1 = require("./ckc.program");
const ckc_program_watch_1 = require("./ckc.program.watch");
const ckc_init_1 = require("./ckc.init");
function id(val) {
    return val;
}
program
    .version("1.1.0", "-v, --version")
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
    ckc_program_watch_1.watchProgram(program.project);
}
else if (program.project) {
    // if we look at a project we'll want to the parse every file, then
    // include all the imports and do the rest...
    ckc_program_1.runProgram(program.project);
}
if (program.file) {
    fs_1.readFile(program.file, "utf8", (err, sourceCode) => {
        exports.maybeRaiseError(err);
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
    ckc_init_1.init(program.project);
}
exports.maybeRaiseError = error => {
    if (error) {
        console.log(error);
        process.exit(1);
    }
};
exports.styleCSS = `
/* RESET */

*, *:before, *:after {
    box-sizing: border-box;
}

html, body {
  font-family: 'Roboto', 'Verdana', sans-serif;
  margin: 0;
  padding: 0;
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
    border: 1px solid lightgray;
    margin-bottom: 1rem;
}

table tr:nth-child(even){background-color: #f2f2f2;}

table tr:hover {background-color: #ddd;}

table th {
    text-align: left;
    background-color: maroon;
    color: white;
}
`;
//# sourceMappingURL=ckc.js.map