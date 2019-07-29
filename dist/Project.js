"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const chokidar_1 = require("chokidar");
const watchAsync = require("file-watch-iterator");
const Module_1 = require("./Module");
const transpiler_1 = require("./transpiler");
const helpers_1 = require("./helpers");
const createIndexPage_1 = require("./transformations/html/createIndexPage");
/**
 * This module is a Project Module. A project is a directory containing
 * a carconfig.json file.
 */
class Project {
    constructor(projectDirectory, useRelativePaths = false, isRelease = false) {
        this.modules = [];
        this.projectDirectory = projectDirectory;
        this.useRelativePaths = useRelativePaths;
        this.configPath = path_1.join(this.projectDirectory, "carconfig.json");
        this.preludePath = path_1.join(this.projectDirectory, "Prelude.car");
        this.outPath = path_1.join(this.projectDirectory, ".out");
        this.isRelease = isRelease;
    }
    get errors() {
        return helpers_1.purge((this.modules || []).map(m => m.errors));
    }
    /**
     * Verify the directory and inspect if the directory is ready to
     * be used for the models.
     */
    verify() {
        // we'll need to verify if:
        //   1) the projectDirectory exists
        //   2) there is a carconfig.json file
        return new Promise((resolve, reject) => {
            try {
                this.config = require(this.configPath);
                this.outPath = path_1.join(this.projectDirectory, this.config.outPath || ".out");
                let version = this.config.version;
                if (!version.startsWith("v")) {
                    version = "v" + version;
                }
                this.versionPath = path_1.join(this.outPath, version);
                this.preludePath = path_1.join(this.versionPath, "Prelude.car");
                this.indexPath = path_1.join(this.versionPath, "index.html");
                resolve(this);
            }
            catch (error) {
                reject(`Failed to verify the Project at ${this.projectDirectory}, could not load "carconfig.json."`);
            }
        });
    }
    init(template) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            return new Promise((resolve, reject) => {
                fs_1.exists(this.configPath, (configExists) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (configExists) {
                        reject("Cannot override the current configuration");
                    }
                    else {
                        let prelude = fs_1.readFileSync(path_1.join(__dirname, "./../src/assets/Prelude.car"), "utf8");
                        yield Promise.all([
                            fs_extra_1.outputFile(this.configPath, JSON.stringify(defaultConfig, null, 4)),
                            fs_extra_1.outputFile(this.preludePath, prelude)
                        ]);
                        resolve(this);
                    }
                }));
            });
        });
    }
    compile(ignore = false) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                yield this.verify();
                this.modules = yield this.getModules();
                this.modules = this.modules.map(m => m.parse());
                this.modules = transpiler_1.resolveImports(this.modules);
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
            }
            catch (err) {
                return err;
            }
        });
    }
    watch() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            console.log(`Start watching the Project`);
            let project = yield this.compile(true);
            try {
                for (var _b = tslib_1.__asyncValues(this.watchCarFiles()), _c; _c = yield _b.next(), !_c.done;) {
                    const file = _c.value;
                    let module = this.modules.find(m => m.fullPath === file);
                    if (!module) {
                        module = yield this.getModule(file);
                        console.log("Gotten the newly created Module.");
                        this.modules.push(module);
                        this.writeIndexFile();
                    }
                    else {
                        module = yield module.update();
                    }
                    if (module) {
                        module.parse();
                        this.modules = transpiler_1.resolveImports(this.modules);
                        module.typeCheck();
                        if (module.errors.length === 0) {
                            module.writeDocumentation();
                            module.writeJSONSchema();
                            module.writeXSD();
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    writeIndexFile() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let source = createIndexPage_1.createIndexPage(this.modules, this.isRelease, this.useRelativePaths);
                fs_extra_1.outputFile(path_1.join(this.versionPath, "index.html"), source);
                resolve(this);
            });
        });
    }
    getCarFiles() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const chokidarConfig = {
                    ignored: this.outPath
                };
                let paths = [];
                let watcher = chokidar_1.watch(this.projectDirectory, chokidarConfig)
                    .on("all", (event, fullPath) => {
                    if (fullPath.endsWith(".car")) {
                        paths.push(fullPath);
                    }
                })
                    .on("error", reject)
                    .on("ready", () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    watcher.close();
                    resolve(helpers_1.purge(paths));
                }));
            });
        });
    }
    watchCarFiles() {
        return tslib_1.__asyncGenerator(this, arguments, function* watchCarFiles_1() {
            var e_2, _a;
            const chokidarConfig = {
                ignored: this.outPath
            };
            let watcher = watchAsync(this.projectDirectory, chokidarConfig);
            try {
                for (var watcher_1 = tslib_1.__asyncValues(watcher), watcher_1_1; watcher_1_1 = yield tslib_1.__await(watcher_1.next()), !watcher_1_1.done;) {
                    const files = watcher_1_1.value;
                    for (const file of files.changed()) {
                        if (file.endsWith(".car")) {
                            yield yield tslib_1.__await(file);
                        }
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (watcher_1_1 && !watcher_1_1.done && (_a = watcher_1.return)) yield tslib_1.__await(_a.call(watcher_1));
                }
                finally { if (e_2) throw e_2.error; }
            }
        });
    }
    getModule(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return new Module_1.Module(this.projectDirectory, this.config).init(name);
            }
            catch (err) {
                console.log(err);
                throw new Error("Could not find module");
            }
        });
    }
    getModules() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                let paths = yield this.getCarFiles();
                let modules = yield Promise.all(paths.map((path) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    let module = yield new Module_1.Module(this.projectDirectory, this.config).init(path);
                    return module;
                })));
                return modules;
            }
            catch (err) {
                console.log(err);
                return [];
            }
        });
    }
    clean() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!this.versionPath) {
                yield this.verify();
            }
            fs_extra_1.remove(this.versionPath);
            return this;
        });
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map