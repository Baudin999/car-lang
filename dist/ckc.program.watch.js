"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const fs_extra_1 = require("fs-extra");
const chokidar_1 = require("chokidar");
const stringHash = require("string-hash");
const ckc_1 = require("./ckc");
const transpiler_1 = require("./transpiler");
const createHTML_1 = require("./html/createHTML");
const createERD_1 = require("./erd/createERD");
// @ts-ignore
const deflate_1 = require("./deflate/deflate");
const helpers_1 = require("./helpers");
const ckc_2 = require("./ckc");
let modules;
exports.watchProgram = projectName => {
    const projectDirectory = path_1.resolve(projectName);
    fs_1.exists(path_1.join(projectDirectory, "carconfig.json"), (e) => {
        if (!e) {
            console.log(`ERROR: 'carconfig.json' does not exists. Please run ckc --init to initialize the project directory or manually create a carconfig.json`);
            process.exit(1);
        }
        let isReady = false;
        modules = {};
        const watcher = chokidar_1.watch(projectDirectory, { ignored: path_1.join(projectDirectory, ".out") })
            .on("all", (event, fullPath) => {
            // (event === "add" || event === "change") && 
            if (fullPath.endsWith(".car")) {
                let moduleName = fullPath
                    .replace(projectDirectory, "")
                    .replace(/\//g, ".")
                    .replace(/^\./, "")
                    .replace(/\.car/, "");
                fs_1.readFile(fullPath, "utf8", (err, source) => {
                    ckc_1.maybeRaiseError(err);
                    if (err)
                        return;
                    const hash = stringHash(source);
                    const { ast } = transpiler_1.createAST(source);
                    console.log(`Finished compiling: ${moduleName}`);
                    modules[moduleName] = {
                        name: moduleName,
                        ast,
                        errors: [],
                        hash,
                        timestamp: new Date()
                    };
                });
                // if (modules[moduleName]) {
                //   parseModule(projectDirectory, modules[moduleName]);
                // }
                if (isReady) {
                    parseModules(projectDirectory, modules);
                }
            }
        })
            .on("ready", () => {
            parseModules(projectDirectory, modules);
            isReady = true;
        });
    });
};
const parseModule = (projectDirectory, module) => {
    // Check if the outpath exists and if so clean it.
    const outPath = path_1.join(projectDirectory, ".out");
    // the root module path
    const modulePath = path_1.join(outPath, module.name);
    // we'll clear all the output of the module
    if (fs_1.existsSync(modulePath)) {
        fs_extra_1.removeSync(modulePath);
    }
    // Save the plant UML file to the directory. And generate a 
    // svg which we can also save to the directory
    const puml = createERD_1.createERD(module.ast);
    if (puml) {
        const filePathPuml = path_1.join(modulePath, module.name + ".puml");
        fs_extra_1.outputFile(filePathPuml, puml);
        const url = deflate_1.generateURL(puml);
        modules[module.name].erdURL = url;
        helpers_1.fetchImage(url).then(img => {
            const filePathSVG = path_1.join(modulePath, module.name + ".svg");
            fs_extra_1.outputFile(filePathSVG, img);
        });
    }
    // Generate the HTML and save it to the directory
    const html = createHTML_1.createHTML(module.ast, puml ? module.name : undefined);
    const filePath = path_1.join(modulePath, module.name + ".html");
    fs_extra_1.outputFile(filePath, html);
};
const parseModules = (projectDirectory, modules) => {
    let hasErrors = false;
    let moduleDictionary = transpiler_1.compile(modules);
    for (let key in moduleDictionary) {
        if (moduleDictionary[key].errors && moduleDictionary[key].errors.length > 0) {
            hasErrors = true;
            console.log("Found errors in: " + key);
            console.log(JSON.stringify(moduleDictionary[key].errors, null, 4));
        }
    }
    // Can't continue if there are errors...
    if (hasErrors) {
        console.log("Quitting the process because I've found errors.");
        return;
    }
    // Check if the outpath exists and if so clean it.
    const outPath = path_1.join(projectDirectory, ".out");
    if (fs_1.existsSync(outPath)) {
        fs_extra_1.removeSync(outPath);
    }
    const stylePath = path_1.join(outPath, "style.css");
    fs_extra_1.outputFile(stylePath, ckc_2.styleCSS);
    for (let key in moduleDictionary) {
        // Get the module.
        let module = moduleDictionary[key];
        // Save the plant UML file to the directory. And generate a 
        // svg which we can also save to the directory
        const puml = createERD_1.createERD(module.ast);
        if (puml) {
            const filePathPuml = path_1.join(outPath, module.name, module.name + ".puml");
            fs_extra_1.outputFile(filePathPuml, puml);
            const url = deflate_1.generateURL(puml);
            helpers_1.fetchImage(url).then(img => {
                const filePathSVG = path_1.join(outPath, module.name, module.name + ".svg");
                fs_extra_1.outputFile(filePathSVG, img);
            });
        }
        // Generate the HTML and save it to the directory
        const html = createHTML_1.createHTML(module.ast, puml ? module.name : undefined);
        const filePath = path_1.join(outPath, module.name, module.name + ".html");
        fs_extra_1.outputFile(filePath, html);
    }
};
//# sourceMappingURL=ckc.program.watch.js.map