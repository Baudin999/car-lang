"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
exports.NumberLiteral = chevrotain_1.createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
exports.StringLiteral = chevrotain_1.createToken({
    name: "StringLiteral",
    pattern: /(["'])(?:(?=(\\?))\2.)*?\1/
});
exports.PatternLiteral = chevrotain_1.createToken({
    name: "PatternLiteral",
    pattern: /\/.+\//
});
//# sourceMappingURL=lexer.literals.js.map