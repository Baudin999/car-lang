import { DomainLexer } from "./lexer";
import { parser } from "./parser";
import { typeChecker } from "./tchecker";
import { OutlineVisitor } from "./outline";
import { getStartToken } from "./helpers";

export const transpile = (content: string, dir?: string) => {
  const tokenStream = DomainLexer.tokenize(content);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const parserErrors = parser.errors.map(error => {
    console.log(JSON.stringify(error, null, 4));
    const bStart = getStartToken((error as any).previousToken);
    let eStart = getStartToken(error.token);
    eStart.startLineNumber = bStart.startLineNumber;
    eStart.startColumn = bStart.startColumn;

    let message;
    if (error.token.image === "=") {
      message = `Encountered a "=" symbol, maybe try a ":"`;
    } else if (error.token.image === "\n\n") {
      message = `Block not finished exception:\nEncountered a couple of new lines, this means that this block has ended and a new block is beginning. Looks like this was not intentional. `;
    }

    return {
      ...eStart,
      severity: 8,
      message: message || error.message || error.name
    };
  });

  const toOutlineVisitor = new OutlineVisitor();
  let result = toOutlineVisitor.visit(cst) || {};
  if (result.ast) {
    const errors = typeChecker(result.ast);
    result.errors = [...result.errors, ...errors, ...parserErrors];

    return result;
  } else {
    result.errors = parserErrors;
    return result;
  }
};
