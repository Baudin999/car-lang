import { DomainLexer } from "./lexer";
import { parser } from "./parser";
import { OutlineVisitor, NodeType, IExpression, IError, IOpen } from "./outline";
import { substituteExtensions, substituteAliases, substitutePluckedFields } from "./substitute";
import { typeChecker } from "./tchecker";
import { IToken } from "chevrotain";
import { IModule, IModuleDictionary } from "./helpers";
import { clone } from "./helpers";
import { Module } from "./Module";
import { ModuleDictionary } from "./ModuleDictionary";
import { ifError } from "assert";

// Modules is the associated hash for looking up module references
// in the other modules (the imports).

const sanitizeSouce = (source: string): string => {
  return source.trimRight();
};

export const transpile = (source: string): ITranspilationResult => {
  // clean up the source
  source = sanitizeSouce(source);

  // first run, create the AST from the source
  const { ast, cst, tokens, errors: astErrors } = createAST(source);

  // now do another pass to update the plucked fields
  let pluckResult = substitutePluckedFields(ast);
  let pluckAST = pluckResult.newAST;

  // substitute the references to the aliasses with the actual aliasses
  let rwAlias = substituteAliases(pluckAST);
  let rwAliasAST = rwAlias.newAST;
  let rwAliasErrors = rwAlias.errors;

  // substitute the extensions, here we add the fields which
  // are added due to the extensions
  var { newAST, errors } = substituteExtensions(rwAliasAST);

  // type check the whole kaboodle.
  const checkASTs = typeChecker(newAST) || [];

  // generate the errors
  let fullErrors = [...(astErrors || []), ...rwAliasErrors, ...errors, ...checkASTs];

  // return the result.
  return {
    tokens,
    cst,
    ast: newAST,
    errors: fullErrors
  };
};

export const createAST = (source: string) => {
  if (!source || source.length === 0) {
    return {
      ast: {},
      tokens: [],
      cst: []
    };
  }
  const lexedSource = DomainLexer.tokenize(source);
  parser.input = lexedSource.tokens;
  const cst = parser.START();

  //   // We've removed this in favour of our custom error messages. But
  //   // uncomment if you want to debug something.
  // if (parser.errors && parser.errors.length > 0) {
  //   console.log(JSON.stringify(parser.errors, null, 4));
  // }

  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);

  let errors = parser.errors.map(error => {
    let message = "";
    if (error.name === "MismatchedTokenException") {
      message =
        error.message +
        `
Previous token was: ${(error as any).previousToken.image}`;
    }

    return {
      message: message,
      ruleStack: (error as any).context ? (error as any).context.ruleStack || [] : null,
      startLineNumber: error.token.startLine,
      endLineNumber: error.token.endLine,
      startColumn: error.token.startColumn,
      endColumn: error.token.endColumn
    } as IError;
  });

  return { ast, tokens: lexedSource.tokens, cst, errors };
};

export const resolveImports = (modules: ModuleDictionary) => {
  return modules.map(module => {
    module.ast
      .filter(node => node.type === NodeType.OPEN)
      .map((node: any) => {
        const m: Module | null = modules.getModule(node.module);
        if (!m) {
          throw "Can't find module " + node.module;
        }
        node.imports.forEach(id => {
          const ref = getNodeById(id, m.ast || []);
          if (ref) module.ast.unshift(clone(ref, { imported: true }));
        });
        return module;
      });
    return module;
  });
};

export const extensions = (modules: ModuleDictionary) => {
  return modules.map(module => {
    let { errors, newAST } = substituteExtensions(module.ast);
    return { ...module, ast: newAST, errors: [...module.errors, ...errors] } as Module;
  });
};

export const pluck = (modules: ModuleDictionary) => {
  return modules.map(module => {
    let { errors, newAST } = substitutePluckedFields(module.ast);
    return { ...module, ast: newAST, errors: [...module.errors, ...errors] } as Module;
  });
};

export const resolveAlias = (modules: ModuleDictionary) => {
  return modules.map(module => {
    const { newAST, errors } = substituteAliases(module.ast);
    return { ...module, ast: newAST, errors: [...module.errors, ...errors] } as Module;
  });
};

export const typeCheck = (modules: ModuleDictionary) => {
  return modules.map(module => {
    let errors = typeChecker(module.ast);
    return { ...module, errors: [...module.errors, ...errors] } as Module;
  });
};

export const compile = (modules: ModuleDictionary): ModuleDictionary => {
  return typeCheck(pluck(resolveAlias(extensions(resolveImports(modules)))));
};

const getNodeById = (id, ast) => {
  return ast.find(node => node.id && node.id === id);
};

export interface ITranspilationResult {
  tokens: IToken[];
  cst: any[];
  ast: IExpression[];
  errors: IError[];
}
