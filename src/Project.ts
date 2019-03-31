import { exists } from "fs";
import { join, normalize } from "path";
import { remove, outputFile, readFile } from "fs-extra";
import { watch } from "chokidar";
import { ModuleDictionary } from "./ModuleDictionary";
import { Module } from "./Module";
import { compile } from "./transpiler";

/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */

export class Project {
    projectDirectory: string;
    configPath: string;
    outPath: string;
    preludePath: string;

    constructor(projectDirectory: string) {
        this.projectDirectory = projectDirectory;
        this.configPath = join(projectDirectory, "carconfig.json");
        this.outPath = join(projectDirectory, ".out");
        this.preludePath = join(projectDirectory, "Prelude.car");
    }

    /**
     * Verify the directory and inspect if the directory is ready to
     * be used for the models.
     */
    verify(): Promise<boolean> {
        // we'll need to verify if:
        //   1) the projectDirectory exists
        //   2) there is a carconfig.json file

        return new Promise(resolve => {
            exists(this.projectDirectory, e => {
                exists(this.configPath, e2 => {
                    resolve(e && e2);
                });
            });
        });
    }

    init(): Promise<boolean> {
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

        return new Promise<boolean | any>((resolve, reject) => {
            console.log("Check existance");
            exists(this.configPath, e => {
                remove(this.configPath, e2 => {
                    try {
                        let promises = [
                            outputFile(this.configPath, JSON.stringify(defaultConfig, null, 4)),
                            outputFile(this.preludePath, prelude, err3 => {
                                console.log(err3);
                            })
                        ];

                        Promise.all(promises).then(results => {
                            resolve(true);
                        });
                    } catch (err) {
                        console.log(err);
                        reject(err);
                    }
                });
            });
        });
    }

    compile(): Promise<ModuleDictionary> | undefined {
        // compile stuff
        return new Promise<ModuleDictionary>((resolve, reject) => {
            // clear the out path
            remove(this.outPath, () => {
                outputFile(join(this.outPath, "style.css"), styleCSS);
                // This function will compile the entire project
                const moduleDictionary = new ModuleDictionary();
                let promises: Promise<Module>[] = [];
                exists(this.configPath, (e: boolean) => {
                    if (!e)
                        reject(
                            "Could not find 'carconfig.json' see manual for details.\n Searching at: " +
                                this.outPath
                        );

                    readFile(this.configPath, "utf8", (err, configSource) => {
                        const config = JSON.parse(configSource);
                        const chokidarConfig = {
                            ignored: this.outPath
                        };
                        const watcher = watch(this.projectDirectory, chokidarConfig)
                            .on("all", (event: string, fullPath: string) => {
                                if (fullPath.endsWith(".car")) {
                                    promises.push(
                                        new Module(this.projectDirectory).parse(fullPath)
                                    );
                                }
                            })
                            .on("ready", () => {
                                watcher.close();
                                Promise.all(promises).then(modules => {
                                    modules.forEach(module => moduleDictionary.addModule(module));
                                    compile(moduleDictionary);
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
        remove(this.outPath, () => {
            outputFile(join(this.outPath, "style.css"), styleCSS);
            // This function will compile the entire project
            const moduleDictionary = new ModuleDictionary();
            let promises: Promise<Module>[] = [];
            exists(this.configPath, (e: boolean) => {
                if (!e) {
                    console.log("Could not find 'carcofig.json' see manual for details.");
                    process.exit(1);
                }

                readFile(this.configPath, "utf8", (err, configSource) => {
                    const config = JSON.parse(configSource);
                    const chokidarConfig = {
                        ignored: this.outPath
                    };
                    const watcher = watch(this.projectDirectory, chokidarConfig)
                        .on("all", (event: string, fullPath: string) => {
                            if (fullPath.endsWith(".car")) {
                                if (event === "add") {
                                    promises.push(
                                        new Module(this.projectDirectory).parse(fullPath)
                                    );
                                } else if (event === "change") {
                                    new Module(this.projectDirectory)
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
                                compile(moduleDictionary);
                                moduleDictionary.writeFiles(this.outPath);
                            });
                        });
                });
            });
        });
    }
}

export const styleCSS = `
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
