import { exists, readFileSync } from "fs";
import { join, normalize } from "path";
import { remove, outputFile, readFile } from "fs-extra";
import { watch } from "chokidar";
const watchAsync = require("file-watch-iterator");
import { Module } from "./Module";
import { resolveImports } from "./transpiler";
import { IConfiguration, readFileAsync, purge, IModule } from "./helpers";
import { substitutePluckedFields, substituteAliases, substituteExtensions } from "./substitute";
import { typeChecker } from "./tchecker";
import chalk from "chalk";
import { cliErrorMessageForModule } from "./ckc.errors";

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
  modules: IModule[] = [];

  get errors() {
    return purge((this.modules || []).map(m => m.errors));
  }

  constructor(projectDirectory: string) {
    this.projectDirectory = projectDirectory;
    this.configPath = join(this.projectDirectory, "carconfig.json");
    this.preludePath = join(this.projectDirectory, "Prelude.car");
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
      try {
        this.config = require(this.configPath);
        this.outPath = join(this.projectDirectory, this.config.outPath || ".out");
        let version = this.config.version;
        if (!version.startsWith("v")) {
          version = "v" + version;
        }

        this.versionPath = join(this.outPath, version);
        this.preludePath = join(this.versionPath, "Prelude.car");
        this.indexPath = join(this.versionPath, "index.html");

        resolve(this);
      } catch (error) {
        reject(
          `Failed to verify the Project at ${
            this.projectDirectory
          }, could not load "carconfig.json."`
        );
      }
    });
  }

  async init(template: any): Promise<Project> {
    const defaultConfig = {
      name: template.name || "Unknown",
      description: template.description || "No description",
      version: "0.0.0",
      xsd: {
        namespace: template.xsd.namespace || "http://example.com/"
      },
      json: {
        namespace: template.json.namespace || "https://example.com"
      }
    };
    return new Promise<boolean | any>((resolve, reject) => {
      exists(this.configPath, async (configExists: boolean) => {
        if (configExists) {
          reject("Cannot override the current configuration");
        } else {
          let prelude = readFileSync(join(__dirname, "./../src/assets/Prelude.car"), "utf8");
          await Promise.all([
            outputFile(this.configPath, JSON.stringify(defaultConfig, null, 4)),
            outputFile(this.preludePath, prelude)
          ]);

          resolve(this);
        }
      });
    });
  }

  async compile(): Promise<Project> {
    try {
      await this.verify();
      this.modules = await this.getModules();
      this.modules = this.modules.map(m => m.parse());
      this.modules = resolveImports(this.modules);
      this.modules = this.modules.map(m => {
        let r0 = substitutePluckedFields(m.ast);
        let r1 = substituteAliases(r0.ast);
        let r2 = substituteExtensions(r1.ast);
        let errors = typeChecker(r2.ast);

        m.ast = r2.ast;
        m.errors = [...m.errors, ...r0.errors, ...r1.errors, ...r2.errors, ...errors];
        return m;
      });
      return this;
    } catch (err) {
      return err;
    }
  }

  async watch() {
    console.log(`Start watching the Project`);
    let project = await this.compile();
    for await (const file of this.watchCarFiles()) {
      let module = this.modules.find(m => m.fullPath === file);
      if (module) {
        module = await module.update();
        module.parse();
        this.modules = resolveImports(this.modules);
        let r0 = substitutePluckedFields(module.ast);
        let r1 = substituteAliases(r0.ast);
        let r2 = substituteExtensions(r1.ast);
        let errors = typeChecker(r2.ast);

        module.ast = r2.ast;
        module.errors = [...module.errors, ...r0.errors, ...r1.errors, ...r2.errors, ...errors];

        // now output the found errors
        if (module.errors && module.errors.length > 0) {
          console.log(chalk.red(`\nWe've found some errors in module "${module.name}"`));
          console.log(cliErrorMessageForModule(module));
        } else {
          console.log(`Perfectly parsed module ${module.name}`);
          //console.log(module.outPath);
          //remove(module.outPath);
          //module.writeDocumentation();
        }
      }
    }
  }

  async getCarFiles(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const chokidarConfig = {
        ignored: this.outPath
      };
      let paths: string[] = [];
      let watcher = watch(this.projectDirectory, chokidarConfig)
        .on("all", (event: string, fullPath: string) => {
          if (fullPath.endsWith(".car")) {
            paths.push(fullPath);
          }
        })
        .on("error", reject)
        .on("ready", async () => {
          watcher.close();
          resolve(purge(paths));
        });
    });
  }

  async *watchCarFiles() {
    const chokidarConfig = {
      ignored: this.outPath
    };
    let watcher = watchAsync(this.projectDirectory, chokidarConfig);
    for await (const files of watcher) {
      for (const file of files.changed()) {
        if (file.endsWith(".car")) {
          yield file;
        }
      }
    }
  }

  async getModule(name: string): Promise<IModule | undefined> {
    try {
      return new Module(this.projectDirectory, this.config).init(name);
    } catch (err) {
      console.log(err);
      return;
    }
  }

  async getModules(): Promise<IModule[]> {
    try {
      let paths = await this.getCarFiles();
      let modules = await Promise.all(
        paths.map(async path => {
          let module = await new Module(this.projectDirectory, this.config).init(path);
          return module;
        })
      );
      return modules;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async clean(): Promise<Project> {
    if (!this.versionPath) {
      await this.verify();
    }
    remove(this.versionPath);
    return this;
  }
}
