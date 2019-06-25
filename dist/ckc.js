"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program = require("commander");
const path_1 = require("path");
const chalk_1 = require("chalk");
const opn = require("open");
const Project_1 = require("./Project");
const ckc_init_1 = require("./ckc.init");
const ckc_errors_1 = require("./ckc.errors");
const promptly = require("promptly");
const packageJSON = require("./../package.json");
let projectPath = path_1.resolve("./");
let moduleName = null;
// function id(val) {
//   return val;
// }
// function setModuleName(m) {
//   console.log(m);
//   moduleName = m;
// }
/**
//  *
//  * @param {string} projectPath path to the project
//  */
// function setProject(p) {
//   projectPath = resolve(p);
//   console.log(`Opening project at: ${projectPath}`);
// }
program.version(packageJSON.version, "-v, --version");
// .option("-a", "Output the AST, default is true")
// .option("-c", "Output the CST, default is false")
// .option("-f, --file <s>", "The input file", id)
// .option("-o, --open <s>", "Open a module", setModuleName)
// .option(
//   "-p, --project <s>",
//   "Specify the project directory, the 'carconfig.json' location",
//   setProject
// )
// .option("-u, --uml", "Output the UML")
// .option(
//   "-w, --watch",
//   "Watch for file changes, can only be used together with the <project> flag."
// )
// .option("-d, --deflate", "Output the deflated uml url");
/**
 * INITIALIZE THE PROJECT
 */
program
    .command("init")
    .alias("i")
    .description("Initialize the project")
    .option("-p, --path", "Optionally the path to the Project, is not specified the current directory will be used.")
    .action((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    let path = args.reverse()[1] || ".";
    let projectPath = path_1.resolve(path);
    const name = yield promptly.prompt("Name: ");
    const description = yield promptly.prompt("Description: ", { default: "" });
    const xsdNamespace = yield promptly.prompt("XSD namespace: ", { default: "no.namesapce.org/" });
    const jsonNamespace = yield promptly.prompt("JSON Schema namespace: ", {
        default: "https://no.namespace.org/"
    });
    const config = {
        name,
        description,
        xsd: { namespace: xsdNamespace },
        json: { namespace: jsonNamespace }
    };
    let project = yield ckc_init_1.initProject(projectPath, config);
}));
/**
 * Verify the current project
 */
program
    .command("verify")
    .option("-p, --path <path>", "The path to build")
    .description("Verify the current project")
    .action((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
        let fullPath = path_1.resolve(path);
        let result = yield new Project_1.Project(fullPath).verify();
        console.log(`Project at ${fullPath} has successfully been verified.`);
    }
    catch (error) {
        console.log(error);
    }
}));
program
    .command("clean")
    .option("-p, --path <path>", "path to be cleaned")
    .description("Clean the current builds and reset the output directory.")
    .action((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
        let fullPath = path_1.resolve(path);
        let result = yield new Project_1.Project(fullPath).clean();
        console.log(`Project at ${result.versionPath} has successfully cleaned.`);
    }
    catch (error) {
        console.log(error);
    }
}));
/**
 * Build the Project and return the result; including the errors.
 */
program
    .command("build")
    .alias("b")
    .description("Build the project")
    .option("-p, --path <path>", "The path to build")
    .option("-m, --module <module>", "The module which needs parsing")
    .option("--xsd", "Build the XSD output")
    .option("-t, --ts", "Build the TypeScript output")
    .option("-a, --all", "Generate all the output")
    .action((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
        let fullPath = path_1.resolve(path);
        let project = yield new Project_1.Project(fullPath).compile();
        if (module) {
            let $module = project.modules.find(m => m.name === module);
            if (!$module) {
                console.log(`${module} could not be found in the result-set. Please check your code and try again.`);
            }
            else {
                if ($module.errors && $module.errors.length > 0) {
                    console.log(chalk_1.default.red("We've found a few errors for you!"));
                    console.log(ckc_errors_1.cliErrorMessageForModule($module));
                }
            }
        }
        else {
            project.modules.forEach(m => {
                if (m.errors && m.errors.length > 0) {
                    console.log(chalk_1.default.red(`\nWe've found some errors in module "${m.name}"`));
                    console.log(ckc_errors_1.cliErrorMessageForModule(m));
                }
                else {
                    console.log(`Perfectly parsed module ${m.name}`);
                    m.writeDocumentation();
                }
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
program
    .command("watch")
    .alias("w")
    .option("-p, --path <path>", "The path to build")
    .description("Watch the project")
    .action((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
        let fullPath = path_1.resolve(path);
        let project = yield new Project_1.Project(fullPath).verify();
        project.watch();
        // for await (const path of project.watchCarFiles()) {
        //   console.log(path);
        // }
    }
    catch (err) {
        console.log(err);
    }
    // log the errors
    // console.log("Building TypeScript");
    // console.log(project);
}));
program
    .command("open")
    .alias("o")
    .option("-p, --path <path>", "The path to the project")
    .option("-m, --module <module>", "The name of the module")
    .description("Open the module")
    .action((...args) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
        let fullPath = path_1.resolve(path);
        let project = yield new Project_1.Project(fullPath).verify();
        let fileName = path_1.join(project.versionPath, module, module + ".html");
        console.log("Opening: " + fileName);
        opn(fileName);
    }
    catch (err) {
        console.log(err);
    }
    // log the errors
    // console.log("Building TypeScript");
    // console.log(project);
}));
program.parse(process.argv);
// program.on("error", e => {
//   console.log(e);
// });
// try {
//   program.parse(process.argv);
// } catch (e) {
//   console.log(e);
// }
/*
if (program.project && program.watch && !program.open) {
  // we'll watch the file system on save...
  new Project(projectPath)
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

// if (program.init) {
//   initProject(projectPath);
// }

if (program.open) {
  new Project(projectPath)
    .verify()
    .then(project => {
      if (!!!moduleName) {
        //
      }
    })
    .catch(err => {
      console.log(err);
    });

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
    let versionPath = join(projectPath, config.outPath || ".out", version);

    if (moduleName === null) {
      const indexPath = join(versionPath, "index.html");
      opn(indexPath);
    } else {
      const htmlPath = join(versionPath, moduleName as string, moduleName + ".html");
      console.log("Opening: file://" + htmlPath);
      opn(htmlPath);
    }
  });
}

export const maybeRaiseError = error => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
};
*/
//# sourceMappingURL=ckc.js.map