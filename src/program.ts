import { readFile } from "fs";
import { transpile } from "./transpiler";
import * as program from "commander";

function id(val) {
  return val;
}

program
  .version("0.0.1", "-v, --version")
  .option("-a", "Output the AST, default is true")
  .option("-c", "Output the CST, default is false")
  .option("-f, --file <s>", "The input file", id)
  .option("-o, --out <s>", "The output file", id)
  .parse(process.argv);

readFile(program.file, "utf8", (err, sourceCode) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  const result = transpile(sourceCode);

  console.log(JSON.stringify(result, null, 4));
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
