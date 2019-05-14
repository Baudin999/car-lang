"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const transpiler_1 = require("./transpiler");
const createERD_1 = require("./erd/createERD");
const program = require("commander");
const path_1 = require("path");
const opn = require("open");
const Project_1 = require("./Project");
let projectPath = path_1.resolve("./");
let moduleName = null;
function id(val) {
    return val;
}
function setModuleName(m) {
    console.log(m);
    moduleName = m;
}
/**
 *
 * @param {string} projectPath path to the project
 */
function setProject(p) {
    projectPath = path_1.resolve(p);
    console.log(`Opening project at: ${projectPath}`);
}
program
    .version("1.3.0", "-v, --version")
    .option("-a", "Output the AST, default is true")
    .option("-c", "Output the CST, default is false")
    .option("-f, --file <s>", "The input file", id)
    .option("-i, --init", "Initialize the 'carconfig.json' file")
    .option("-o, --open <s>", "Open a module", setModuleName)
    .option("-p, --project <s>", "Specify the project directory, the 'carconfig.json' location", setProject)
    .option("-u, --uml", "Output the UML")
    .option("-w, --watch", "Watch for file changes, can only be used together with the <project> flag.")
    .option("-d, --deflate", "Output the deflated uml url")
    .parse(process.argv);
if (program.project && program.watch && !program.open) {
    // we'll watch the file system on save...
    new Project_1.Project(projectPath)
        .verify()
        .then(project => {
        project.watch();
        setTimeout(() => {
            opn(project.indexPath);
        }, 100);
    })
        .catch(error => {
        console.log(error);
        process.exit(1);
    });
}
else if (program.project && !program.open) {
    // if we look at a project we'll want to the parse every file, then
    // include all the imports and do the rest...
    //runProgram(program.project);
    new Project_1.Project(projectPath)
        .verify()
        .then(project => {
        project.compile();
    })
        .catch(error => {
        console.log(error);
        process.exit(1);
    });
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
    new Project_1.Project(projectPath)
        .init()
        .then(success => {
        if (success) {
            console.log("");
            process.exit(0);
        }
        else {
            process.exit(1);
        }
    })
        .catch(e => {
        console.log("Failed to initialize the project");
        console.log(e);
        process.exit(1);
    });
}
if (program.open) {
    fs_1.readFile(path_1.join(projectPath, "carconfig.json"), "utf8", (err, data) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        const config = JSON.parse(data);
        let version = config.version;
        if (!version.startsWith("v")) {
            version = "v" + version;
        }
        let versionPath = path_1.join(projectPath, config.outPath || ".out", version);
        if (moduleName === null) {
            const indexPath = path_1.join(versionPath, "index.html");
            opn(indexPath);
        }
        else {
            const htmlPath = path_1.join(versionPath, moduleName, moduleName + ".html");
            console.log("Opening: file://" + htmlPath);
            opn(htmlPath);
        }
    });
}
exports.maybeRaiseError = error => {
    if (error) {
        console.log(error);
        process.exit(1);
    }
};
//# sourceMappingURL=ckc.js.map