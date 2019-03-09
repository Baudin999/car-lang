"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const outline_1 = require("./outline");
const program = require("commander");
function id(val) {
    return val;
}
program
    .version("0.0.1")
    .option("-a", "Output AST")
    .option("-f, --file <s>", "The input file", id)
    .parse(process.argv);
fs_1.readFile(program.file, "utf8", (err, sourceCode) => {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    const lexedSource = lexer_1.DomainLexer.tokenize(sourceCode);
    parser_1.parser.input = lexedSource.tokens;
    const cst = parser_1.parser.START();
    const visitor = new outline_1.OutlineVisitor();
    const ast = visitor.visit(cst);
    console.log(JSON.stringify(ast, null, 4));
    process.exit(0);
});
// export const transpile = (content: string, dir?: string) => {
//   const tokenStream = DomainLexer.tokenize(content);
//   parser.input = tokenStream.tokens;
//   const cst = parser.START();
//   const parserErrors = parser.errors.map(error => {
//     console.log(JSON.stringify(error, null, 4));
//     const bStart = getStartToken((error as any).previousToken);
//     let eStart = getStartToken(error.token);
//     eStart.startLineNumber = bStart.startLineNumber;
//     eStart.startColumn = bStart.startColumn;
//     let message;
//     if (error.token.image === "=") {
//       message = `Encountered a "=" symbol, maybe try a ":"`;
//     } else if (error.token.image === "\n\n") {
//       message = `Block not finished exception:\nEncountered a couple of new lines, this means that this block has ended and a new block is beginning. Looks like this was not intentional. `;
//     }
//     return {
//       ...eStart,
//       severity: 8,
//       message: message || error.message || error.name
//     };
//   });
//   const toOutlineVisitor = new OutlineVisitor();
//   let result = toOutlineVisitor.visit(cst) || {};
//   if (result.ast) {
//     const errors = typeChecker(result.ast);
//     result.errors = [...result.errors, ...errors, ...parserErrors];
//     return result;
//   } else {
//     result.errors = parserErrors;
//     return result;
//   }
// };
//# sourceMappingURL=transpiler.js.map