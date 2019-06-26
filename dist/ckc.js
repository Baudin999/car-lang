"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const program = require("commander");
const path_1 = require("path");
const opn = require("open");
const Project_1 = require("./Project");
const ckc_init_1 = require("./ckc.init");
const promptly = require("promptly");
const packageJSON = require("./../package.json");
program.version(packageJSON.version, "-v, --version");
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
    }
    catch (err) {
        console.log(err);
    }
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
        if (module) {
            let fileName = path_1.join(project.versionPath, module, module + ".html");
            console.log("Opening: " + fileName);
            opn(fileName);
        }
        else {
            let fileName = path_1.join(project.versionPath, "index.html");
            console.log("Opening: " + fileName);
            opn(fileName);
        }
    }
    catch (err) {
        console.log(err);
    }
}));
program.parse(process.argv);
//# sourceMappingURL=ckc.js.map