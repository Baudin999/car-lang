import { DomainLexer } from "./lexer";
import { parser } from "./parser";
import { OutlineVisitor } from "./outline";
import { substituteExtensions, substituteAliases } from "./substitute";
import { typeChecker } from "./tchecker";

export const transpile = (source: string) => {
  const lexedSource = DomainLexer.tokenize(source);
  parser.input = lexedSource.tokens;
  const cst = parser.START();

  if (parser.errors && parser.errors.length > 0) {
    console.log(parser.errors);
  }

  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);

  let rwAlias = substituteAliases(ast);
  let rwAliasAST = rwAlias.newAST;
  let rwAliasErrors = rwAlias.errors;

  var { newAST, errors } = substituteExtensions(rwAliasAST);

  const checkASTs = typeChecker(newAST) || [];

  return {
    tokens: lexedSource.tokens,
    cst,
    ast: newAST,
    errors: [...rwAliasErrors, ...errors, ...checkASTs]
  };
};
