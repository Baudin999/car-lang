"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const ckc_1 = require("./ckc");
exports.init = (projectName) => {
    const p = path_1.resolve(projectName || ".");
    const carconfigFile = path_1.join(p, "carconfig.json");
    const body = {
        version: "0.0.1",
        title: "The title",
        description: "The description"
    };
    fs_1.writeFile(carconfigFile, JSON.stringify(body, null, 4), "utf8", (error) => {
        ckc_1.maybeRaiseError(error);
        process.exit(0);
    });
};
//# sourceMappingURL=ckc.init.js.map