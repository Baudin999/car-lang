"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const chokidar_1 = require("chokidar");
const ModuleDictionary_1 = require("./ModuleDictionary");
const Module_1 = require("./Module");
const transpiler_1 = require("./transpiler");
/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */
class Project {
    constructor(projectDirectory) {
        this.projectDirectory = projectDirectory;
        this.configPath = path_1.join(projectDirectory, "carconfig.json");
        this.outPath = path_1.join(projectDirectory, ".out");
        this.preludePath = path_1.join(projectDirectory, "Prelude.car");
    }
    /**
     * Verify the directory and inspect if the directory is ready to
     * be used for the models.
     */
    verify() {
        // we'll need to verify if:
        //   1) the projectDirectory exists
        //   2) there is a carconfig.json file
        return new Promise(resolve => {
            fs_1.exists(this.projectDirectory, e => {
                fs_1.exists(this.configPath, e2 => {
                    resolve(e && e2);
                });
            });
        });
    }
    init() {
        const defaultConfig = {
            name: "Unknown",
            description: "No description",
            version: 0,
            xsd: {
                namespace: "http://example.com/"
            },
            json: {
                namespace: "https://example.com"
            }
        };
        const prelude = `
# Prelude

The prelude is a simple set of types you can use to build 
more complex types.

@ A list
type List a

@ A nullable type
data Maybe a =
    | Just a
    | Nothing


        `.trim();
        return new Promise((resolve, reject) => {
            console.log("Check existance");
            fs_1.exists(this.configPath, e => {
                console.log("Existance: " + e);
                fs_extra_1.remove(this.configPath, e2 => {
                    console.log("Tried to remove " + e2);
                    try {
                        console.log(this.configPath);
                        console.log(this.preludePath);
                        let promises = [
                            fs_extra_1.outputFile(this.configPath, JSON.stringify(defaultConfig, null, 4)),
                            fs_extra_1.outputFile(this.preludePath, prelude, err3 => {
                                console.log(err3);
                            })
                        ];
                        Promise.all(promises).then(results => {
                            console.log("Results: ", results);
                            resolve(true);
                        });
                    }
                    catch (err) {
                        console.log(err);
                        reject(err);
                    }
                });
            });
        });
    }
    compile() {
        // compile stuff
        return new Promise((resolve, reject) => {
            // clear the out path
            fs_extra_1.remove(this.outPath, () => {
                fs_extra_1.outputFile(path_1.join(this.outPath, "style.css"), exports.styleCSS);
                // This function will compile the entire project
                const moduleDictionary = new ModuleDictionary_1.ModuleDictionary();
                let promises = [];
                fs_1.exists(this.configPath, (e) => {
                    if (!e)
                        reject("Could not find 'carconfig.json' see manual for details.\n Searching at: " +
                            this.outPath);
                    fs_extra_1.readFile(this.configPath, "utf8", (err, configSource) => {
                        const config = JSON.parse(configSource);
                        const chokidarConfig = {
                            ignored: this.outPath
                        };
                        const watcher = chokidar_1.watch(this.projectDirectory, chokidarConfig)
                            .on("all", (event, fullPath) => {
                            if (fullPath.endsWith(".car")) {
                                promises.push(new Module_1.Module(this.projectDirectory).parse(fullPath));
                            }
                        })
                            .on("ready", () => {
                            watcher.close();
                            Promise.all(promises).then(modules => {
                                modules.forEach(module => moduleDictionary.addModule(module));
                                transpiler_1.compile(moduleDictionary);
                                moduleDictionary.writeFiles(this.outPath);
                                resolve(moduleDictionary);
                            });
                        });
                    });
                });
            });
        });
    }
    watch() {
        fs_extra_1.remove(this.outPath, () => {
            fs_extra_1.outputFile(path_1.join(this.outPath, "style.css"), exports.styleCSS);
            // This function will compile the entire project
            const moduleDictionary = new ModuleDictionary_1.ModuleDictionary();
            let promises = [];
            fs_1.exists(this.configPath, (e) => {
                if (!e) {
                    console.log("Could not find 'carcofig.json' see manual for details.");
                    process.exit(1);
                }
                fs_extra_1.readFile(this.configPath, "utf8", (err, configSource) => {
                    const config = JSON.parse(configSource);
                    const chokidarConfig = {
                        ignored: this.outPath
                    };
                    const watcher = chokidar_1.watch(this.projectDirectory, chokidarConfig)
                        .on("all", (event, fullPath) => {
                        if (fullPath.endsWith(".car")) {
                            if (event === "add") {
                                promises.push(new Module_1.Module(this.projectDirectory).parse(fullPath));
                            }
                            else if (event === "change") {
                                new Module_1.Module(this.projectDirectory)
                                    .parse(fullPath)
                                    .then(module => {
                                    moduleDictionary.changeAndWrite(module, this.outPath);
                                });
                            }
                        }
                    })
                        .on("ready", () => {
                        Promise.all(promises).then(modules => {
                            modules.forEach(module => moduleDictionary.addModule(module));
                            transpiler_1.compile(moduleDictionary);
                            moduleDictionary.writeFiles(this.outPath);
                        });
                    });
                });
            });
        });
    }
}
exports.Project = Project;
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
//# sourceMappingURL=Project.js.map