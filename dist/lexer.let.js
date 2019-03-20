"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const lexer_literals_1 = require("./lexer.literals");
const lexer_common_1 = require("./lexer.common");
/* THE LET TOKENS */
exports.KW_let = chevrotain_1.createToken({
    name: "KW_let",
    pattern: /let/,
    push_mode: "let_definition"
});
const let_equals = chevrotain_1.createToken({
    name: "let_equals",
    pattern: /=/
});
const let_parameter = chevrotain_1.createToken({
    name: "let_parameter",
    pattern: /[a-z][a-zA-Z0-9_]*/
});
const let_identifier = chevrotain_1.createToken({
    name: "let_identifier",
    pattern: /[a-z][a-zA-Z0-9_]*(?= *(=|[a-z]))/
});
exports.let_definition = [lexer_common_1.EndBlock, let_equals, let_identifier, lexer_literals_1.NumberLiteral, lexer_literals_1.StringLiteral];
exports.modTokens = (tokens) => {
    tokens["KW_let"] = exports.KW_let;
    tokens["let_equals"] = let_equals;
    tokens["let_identifier"] = let_identifier;
    tokens["let_parameter"] = let_parameter;
};
exports.Modify = ($, tokenLookup = {}) => {
    $.RULE("LET", () => {
        $.CONSUME(exports.KW_let);
        $.CONSUME(let_identifier);
        $.MANY(() => $.CONSUME(let_parameter));
        $.CONSUME(let_equals);
        $.CONSUME(lexer_literals_1.NumberLiteral);
        //$.OR([{ ALT: () => $.CONSUME(StringLiteral) }, { ALT: () => $.CONSUME(NumberLiteral) }]);
    });
};
//# sourceMappingURL=lexer.let.js.map