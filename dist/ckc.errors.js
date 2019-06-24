"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
exports.cliErrorMessageForModule = (module) => {
    let errors = module.errors.map(error => {
        let indicator = chalk_1.default.yellow(`[${module.name}: line ${error.startLineNumber} column ${error.startColumn}]`);
        return `${indicator} ${error.message}`;
    });
    return errors.join("\n") + "\n";
};
//# sourceMappingURL=ckc.errors.js.map