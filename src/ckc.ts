import { readFile } from "fs";
import { transpile, compile } from "./transpiler";
import { createERD } from "./erd/createERD";
import * as program from "commander";
import { resolve, join } from "path";
import * as opn from "open";
import { Project } from "./Project";

let projectPath: string = resolve(".");
let moduleName: string | null = null;

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
    projectPath = resolve(p);
    console.log(`Opening project at: ${projectPath}`);
}

program
    .version("1.3.0", "-v, --version")
    .option("-a", "Output the AST, default is true")
    .option("-c", "Output the CST, default is false")
    .option("-f, --file <s>", "The input file", id)
    .option("-i, --init", "Initialize the 'carconfig.json' file")
    .option("-o, --open <s>", "Open a module", setModuleName)
    .option(
        "-p, --project <s>",
        "Specify the project directory, the 'carconfig.json' location",
        setProject
    )
    .option("-u, --uml", "Output the UML")
    .option(
        "-w, --watch",
        "Watch for file changes, can only be used together with the <project> flag."
    )
    .option("-d, --deflate", "Output the deflated uml url")
    .parse(process.argv);

if (program.project && program.watch && !program.open) {
    // we'll watch the file system on save...
    new Project(projectPath)
        .verify()
        .then(project => {
            project.watch();
        })
        .catch(error => {
            console.log(error);
            process.exit(1);
        });
} else if (program.project && !program.open) {
    // if we look at a project we'll want to the parse every file, then
    // include all the imports and do the rest...
    //runProgram(program.project);
    new Project(projectPath)
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
    new Project(projectPath)
        .init()
        .then(success => {
            if (success) {
                console.log("");
                process.exit(0);
            } else {
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
    if (moduleName === null) throw "Module Name not set";
    readFile(join(projectPath, "carconfig.json"), "utf8", (err, data) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        const config = JSON.parse(data);
        let version = config.version;
        if (!version.startsWith("v")) {
            version = "v" + version;
        }
        let versionPath = join(projectPath, ".out", version);
        const htmlPath = join(versionPath, moduleName as string, moduleName + ".html");
        console.log("Opening: file://" + htmlPath);
        opn("file://" + htmlPath);
    });
}

export const maybeRaiseError = error => {
    if (error) {
        console.log(error);
        process.exit(1);
    }
};
