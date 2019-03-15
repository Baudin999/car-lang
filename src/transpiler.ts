import { DomainLexer } from "./lexer";
import { parser } from "./parser";
import { OutlineVisitor, IExpression } from "./outline";
import { substituteExtensions, substituteAliases } from "./substitute";
import { typeChecker, IError } from "./tchecker";
import { IToken } from "chevrotain";

// Modules is the associated hash for looking up module references
// in the other modules (the imports).
let modules = {};

export const transpile = (source: string): ITranspilationResult => {
  const lexedSource = DomainLexer.tokenize(source);
  parser.input = lexedSource.tokens;
  const cst = parser.START();

  if (parser.errors && parser.errors.length > 0) {
    console.log(JSON.stringify(parser.errors, null, 4));
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

export interface ITranspilationResult {
  tokens: IToken[];
  cst: any[];
  ast: IExpression[];
  errors: IError[];
}
