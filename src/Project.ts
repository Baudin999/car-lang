import { exists, readFileSync } from "fs";
import { join } from "path";
import { remove, outputFile } from "fs-extra";
import { watch } from "chokidar";
const watchAsync = require("file-watch-iterator");
import { Module } from "./Module";
import { resolveImports } from "./transpiler";
import { IConfiguration, readFileAsync, purge, IModule } from "./helpers";
import { createIndexPage } from "./transformations/html/createIndexPage";

/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */

export class Project {
  projectDirectory: string;
  useRelativePaths: boolean;
  configPath: string;
  outPath: string;
  versionPath: string;
  preludePath: string;
  indexPath: string;
  isRelease: boolean;
  config: IConfiguration;
  modules: IModule[] = [];

  get errors() {
    return purge((this.modules || []).map(m => m.errors));
  }

  constructor(projectDirectory: string, useRelativePaths: boolean = false, isRelease: boolean = false) {
    this.projectDirectory = projectDirectory;
    this.useRelativePaths = useRelativePaths;
    this.configPath = join(this.projectDirectory, "carconfig.json");
    this.preludePath = join(this.projectDirectory, "Prelude.car");
    this.outPath = join(this.projectDirectory, ".out");
    this.isRelease = isRelease;
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

  async compile(ignore = false): Promise<Project> {
    try {
      await this.verify();
      this.modules = await this.getModules();
      this.modules = this.modules.map(m => m.parse());
      this.modules = resolveImports(this.modules);
      this.modules = this.modules.map(m => {
        if (!ignore) {
          m.typeCheck();
          if (m.errors.length === 0) {
            m.writeDocumentation();
            m.writeJSONSchema();
            m.writeXSD();
          }
        }
        return m;
      });
      this.writeIndexFile();
      return this;
    } catch (err) {
      return err;
    }
  }

  async watch() {
    console.log(`Start watching the Project`);
    let project = await this.compile(true);
    for await (const file of this.watchCarFiles()) {
      let module = this.modules.find(m => m.fullPath === file);
      if (!module) {
        module = await this.getModule(file);
        console.log("Gotten the newly created Module.");
        this.modules.push(module);
        this.writeIndexFile();
      } else {
        module = await module.update();
      }
      if (module) {
        module.parse();
        this.modules = resolveImports(this.modules);
        module.typeCheck();
        if (module.errors.length === 0) {
          module.writeDocumentation();
          module.writeJSONSchema();
          module.writeXSD();
        }
      }
    }
  }

  async writeIndexFile(): Promise<Project> {
    return new Promise((resolve, reject) => {
      let source = createIndexPage(this.modules, this.isRelease, this.useRelativePaths);
      outputFile(join(this.versionPath, "index.html"), source);
      resolve(this);
    });
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

  async getModule(name: string): Promise<IModule> {
    try {
      return new Module(this.projectDirectory, this.config).init(name);
    } catch (err) {
      console.error(err);
      throw new Error("Could not find module");
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
      console.error(err);
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
