"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
exports.EndBlock = chevrotain_1.createToken({
    name: "EndBlock",
    pattern: /\n(\s*\n)+(?!\s)/,
    push_mode: "root",
    group: chevrotain_1.Lexer.SKIPPED
});
//# sourceMappingURL=lexer.common.js.map