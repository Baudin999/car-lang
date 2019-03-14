"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const outline_1 = require("./outline");
const substitute_1 = require("./substitute");
const tchecker_1 = require("./tchecker");
exports.transpile = (source) => {
    const lexedSource = lexer_1.DomainLexer.tokenize(source);
    parser_1.parser.input = lexedSource.tokens;
    const cst = parser_1.parser.START();
    if (parser_1.parser.errors && parser_1.parser.errors.length > 0) {
        console.log(JSON.stringify(parser_1.parser.errors, null, 4));
    }
    const visitor = new outline_1.OutlineVisitor();
    const ast = visitor.visit(cst);
    let rwAlias = substitute_1.substituteAliases(ast);
    let rwAliasAST = rwAlias.newAST;
    let rwAliasErrors = rwAlias.errors;
    var { newAST, errors } = substitute_1.substituteExtensions(rwAliasAST);
    const checkASTs = tchecker_1.typeChecker(newAST) || [];
    return {
        tokens: lexedSource.tokens,
        cst,
        ast: newAST,
        errors: [...rwAliasErrors, ...errors, ...checkASTs]
    };
};
//# sourceMappingURL=transpiler.js.map