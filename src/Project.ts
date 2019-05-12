import { exists } from "fs";
import { join, normalize } from "path";
import { remove, outputFile, readFile } from "fs-extra";
import { watch } from "chokidar";
import { ModuleDictionary } from "./ModuleDictionary";
import { Module } from "./Module";
import { compile } from "./transpiler";
import { IConfiguration } from "./helpers";

/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */

export class Project {
  projectDirectory: string;
  configPath: string;
  outPath: string;
  versionPath: string;
  preludePath: string;
  indexPath: string;
  config: IConfiguration;

  constructor(projectDirectory: string) {
    this.projectDirectory = projectDirectory;
    this.configPath = join(this.projectDirectory, "carconfig.json");
    this.outPath = join(this.projectDirectory, ".out");
  }

  /**
   * Verify the directory and inspect if the directory is ready to
   * be used for the models.
   */
  verify(): Promise<Project> {
    // we'll need to verify if:
    //   1) the projectDirectory exists
    //   2) there is a carconfig.json file

    return new Promise((resolve, reject) => {
      const message = "Project does not exists. Please run -i --init to initialize the Project.";
      exists(this.projectDirectory, e => {
        if (!e) {
          reject(message);
        }
        readFile(this.configPath, (err, config) => {
          if (err) {
            reject(err);
          } else {
            this.config = JSON.parse(config) as IConfiguration;
            this.outPath = join(this.projectDirectory, this.config.outPath || ".out");
            let version = this.config.version;
            if (!version.startsWith("v")) {
              version = "v" + version;
            }

            this.versionPath = join(this.outPath, version);
            this.preludePath = join(this.versionPath, "Prelude.car");
            this.indexPath = join(this.versionPath, "index.html");

            resolve(this);
          }
        });
      });
    });
  }

  init(): Promise<boolean> {
    const defaultConfig = {
      name: "Unknown",
      description: "No description",
      version: "0.0.0",
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
            let promises = [outputFile(this.configPath, JSON.stringify(defaultConfig, null, 4))];

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
      remove(this.versionPath, () => {
        outputFile(join(this.versionPath, "style.css"), styleCSS);
        // This function will compile the entire project
        const moduleDictionary = new ModuleDictionary(this.config);
        let promises: Promise<Module>[] = [];
        exists(this.configPath, (e: boolean) => {
          if (!e)
            reject(
              "Could not find 'carconfig.json' see manual for details.\n Searching at: " +
                this.outPath
            );

          readFile(this.configPath, "utf8", (err, configSource) => {
            const config = JSON.parse(configSource) as IConfiguration;
            const chokidarConfig = {
              ignored: this.outPath
            };
            const watcher = watch(this.projectDirectory, chokidarConfig)
              .on("all", (event: string, fullPath: string) => {
                if (fullPath.endsWith(".car")) {
                  promises.push(new Module(this.projectDirectory, config).parse(fullPath));
                }
              })
              .on("ready", () => {
                watcher.close();
                Promise.all(promises).then(modules => {
                  modules.forEach(module => moduleDictionary.addModule(module));
                  compile(moduleDictionary);
                  moduleDictionary.writeFiles(this.versionPath);
                  resolve(moduleDictionary);
                });
              });
          });
        });
      });
    });
  }

  watch() {
    remove(this.versionPath, () => {
      outputFile(join(this.versionPath, "style.css"), styleCSS);
      // This function will compile the entire project
      const moduleDictionary = new ModuleDictionary(this.config);
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
                  promises.push(new Module(this.projectDirectory).parse(fullPath));
                } else if (event === "change") {
                  new Module(this.projectDirectory).parse(fullPath).then(module => {
                    moduleDictionary.changeAndWrite(module, this.versionPath);
                  });
                }
              }
            })
            .on("ready", () => {
              Promise.all(promises).then(modules => {
                modules.forEach(module => moduleDictionary.addModule(module));
                compile(moduleDictionary);
                moduleDictionary.writeFiles(this.versionPath);
              });
            });
        });
      });
    });
  }
}

export const styleCSS = `
/* RESET */

*,
*:before,
*:after {
    box-sizing: border-box;
}

html,
body {
    font-family: "Roboto", "Verdana", sans-serif;
    margin: 0;
    padding: 0;
    position: relative;
    height: 100%;
    width: 100%;
}

body {
    overflow: auto;
    /*background: rgb(240, 240, 240);*/
    padding: 1rem;
}

p {
    text-align: justify;
}

/*
.page {
    width: 21cm;
    min-height: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    padding: 1rem;
    position: absolute;
    border: 1px solid lightgray;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
*/

table a:link {
    color: #666;
    font-weight: bold;
    text-decoration: none;
}
table a:visited {
    color: #999999;
    font-weight: bold;
    text-decoration: none;
}
table a:active,
table a:hover {
    color: #bd5a35;
    text-decoration: underline;
}
table {
    width: 100%;
    font-family: Arial, Helvetica, sans-serif;
    color: #666;
    font-size: 12px;
    text-shadow: 1px 1px 0px #fff;
    background: #eaebec;
    border: #ccc 1px solid;

    -moz-border-radius: 3px;
    -webkit-border-radius: 3px;
    border-radius: 3px;

    -moz-box-shadow: 0 1px 2px #d1d1d1;
    -webkit-box-shadow: 0 1px 2px #d1d1d1;
    box-shadow: 0 1px 2px #d1d1d1;
    margin-bottom: 2rem;

    page-break-inside: avoid;
}
table th {
    text-align: center;
    padding: 3px;
    border-top: 1px solid #fafafa;
    border-bottom: 1px solid #e0e0e0;

    background: #ededed;
    background: -webkit-gradient(linear, left top, left bottom, from(#ededed), to(#ebebeb));
    background: -moz-linear-gradient(top, #ededed, #ebebeb);
}
table th:first-child {
    text-align: left;
    padding-left: 20px;
}
table tr:first-child th:first-child {
    -moz-border-radius-topleft: 3px;
    -webkit-border-top-left-radius: 3px;
    border-top-left-radius: 3px;
}
table tr:first-child th:last-child {
    -moz-border-radius-topright: 3px;
    -webkit-border-top-right-radius: 3px;
    border-top-right-radius: 3px;
}
table tr {
    text-align: left;
    padding-left: 20px;
}
table td:first-child {
    text-align: left;
    padding-left: 20px;
    border-left: 0;
}
table td {
    border-top: 1px solid #ffffff;
    border-bottom: 1px solid #e0e0e0;
    border-left: 1px solid #e0e0e0;

    background: #fafafa;
    background: -webkit-gradient(linear, left top, left bottom, from(#fbfbfb), to(#fafafa));
    background: -moz-linear-gradient(top, #fbfbfb, #fafafa);
    padding: 3px 15px;
}
table tr.even td {
    background: #f6f6f6;
    background: -webkit-gradient(linear, left top, left bottom, from(#f8f8f8), to(#f6f6f6));
    background: -moz-linear-gradient(top, #f8f8f8, #f6f6f6);
}
table tr:last-child td {
    border-bottom: 0;
}
table tr:last-child td:first-child {
    -moz-border-radius-bottomleft: 3px;
    -webkit-border-bottom-left-radius: 3px;
    border-bottom-left-radius: 3px;
}
table tr:last-child td:last-child {
    -moz-border-radius-bottomright: 3px;
    -webkit-border-bottom-right-radius: 3px;
    border-bottom-right-radius: 3px;
}
table tr:hover td {
    background: #f2f2f2;
    background: -webkit-gradient(linear, left top, left bottom, from(#f2f2f2), to(#f0f0f0));
    background: -moz-linear-gradient(top, #f2f2f2, #f0f0f0);
}
.image-container {
    max-width: 100%;
}
.image-container img {
    max-width: 100%;
}
`;
