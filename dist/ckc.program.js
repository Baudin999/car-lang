"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const chokidar_1 = require("chokidar");
const stringHash = require("string-hash");
const ckc_1 = require("./ckc");
const transpiler_1 = require("./transpiler");
exports.runProgram = projectName => {
    const projectDirectory = path_1.resolve(projectName);
    fs_1.exists(path_1.join(projectDirectory, "carconfig.json"), (e) => {
        if (!e) {
            console.log(`ERROR: 'carconfig.json' does not exists. Please run ckc --init to initialize the project directory or manually create a carconfig.json`);
            process.exit(1);
        }
        let modules = {};
        const watcher = chokidar_1.watch(projectDirectory)
            .on("all", (event, fullPath) => {
            if (fullPath.endsWith(".car")) {
                let moduleName = fullPath
                    .replace(projectDirectory, "")
                    .replace(/\//g, ".")
                    .replace(/^\./, "")
                    .replace(/\.car/, "");
                fs_1.readFile(fullPath, "utf8", (err, source) => {
                    ckc_1.maybeRaiseError(err);
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
            }
        })
            .on("ready", () => {
            watcher.close();
            let moduleDictionary = transpiler_1.typeCheck(transpiler_1.substitute(transpiler_1.resolveImports(modules)));
            for (let key in moduleDictionary) {
                if (moduleDictionary[key].errors && moduleDictionary[key].errors.length > 0) {
                    console.log("Found errors in: " + key);
                    console.log(JSON.stringify(moduleDictionary[key].errors, null, 4));
                }
            }
        });
    });
};
//# sourceMappingURL=ckc.program.js.map