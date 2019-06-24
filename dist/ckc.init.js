"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { resolve, join } from "path";
// import { writeFile } from "fs";
// import { maybeRaiseError } from "./ckc";
const Project_1 = require("./Project");
exports.initProject = (projectPath, config) => {
    new Project_1.Project(projectPath)
        .init(config)
        .then(success => {
        if (success) {
            process.exit(0);
        }
        else {
            process.exit(1);
        }
    })
        .catch(e => {
        console.log("Failed to initialize the project");
        console.log(e);
        process.exit(1);
    });
};
//# sourceMappingURL=ckc.init.js.map