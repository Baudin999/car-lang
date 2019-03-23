import { DomainLexer } from "./lexer";
import { parser } from "./parser";
import { OutlineVisitor, NodeType, IExpression, IError, IOpen } from "./outline";
import { resolve } from "./resolver";
import { substituteExtensions, substituteAliases, substitutePluckedFields } from "./substitute";
import { typeChecker } from "./tchecker";
import { IToken } from "chevrotain";
import { IModule, IModuleDictionary } from "./ckc";
import { fmapModules, clone } from "./helpers";

// Modules is the associated hash for looking up module references
// in the other modules (the imports).

export const transpile = (source: string): ITranspilationResult => {
  const { ast, cst, tokens } = createAST(source);


  let pluckResult = substitutePluckedFields(ast);
  let pluckAST = pluckResult.newAST;

  let rwAlias = substituteAliases(pluckAST);
  let rwAliasAST = rwAlias.newAST;
  let rwAliasErrors = rwAlias.errors;

  var { newAST, errors } = substituteExtensions(rwAliasAST);

  const checkASTs = typeChecker(newAST) || [];

  return {
    tokens,
    cst,
    ast: newAST,
    errors: [...rwAliasErrors, ...errors, ...checkASTs]
  };
};

export const createAST = (source: string) => {
  if (!source || source.length === 0) {
    return {
      ast: {},
      tokens: [],
      cst: []
    }
  }
  const lexedSource = DomainLexer.tokenize(source);
  parser.input = lexedSource.tokens;
  const cst = parser.START();

  if (parser.errors && parser.errors.length > 0) {
    console.log(JSON.stringify(parser.errors, null, 4));
  }

  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);

  return { ast, tokens: lexedSource.tokens, cst };
};

export const resolveImports = (modules: IModuleDictionary) => {
  return fmapModules(modules).map(module => {
    module.ast
      .filter(node => node.type === NodeType.OPEN)
      .map((node: any) => {
        const m: IModule = modules[node.module];
        if (!m) {
          throw "Can't find module " + node.module;
        }
        node.imports.forEach(id => {
          const ref = getNodeById(id, m.ast || []);
          if (ref) module.ast.unshift(clone(ref, {imported: true }));
        });
        return module;
      });
    return module;
  });
};

export const extensions = (modules: IModuleDictionary) => {
  return fmapModules(modules).map(module => {
    let { errors, newAST } = substituteExtensions(module.ast);
    return { ...module, ast: newAST, errors: [...module.errors, ...errors] };
  });
};


export const pluck = (modules: IModuleDictionary) => {
  return fmapModules(modules).map(module => {
    let { errors, newAST } = substitutePluckedFields(module.ast);
    return { ...module, ast: newAST, errors: [...module.errors, ...errors] };
  });
};

export const resolveAlias = (modules: IModuleDictionary) => {
  return fmapModules(modules).map(module => {
    const { newAST, errors } = substituteAliases(module.ast);
    return { ...module, ast: newAST, errors: [...module.errors, ...errors] };
  });
};

export const typeCheck = (modules: IModuleDictionary) => {
  return fmapModules(modules).map(module => {
    let errors = typeChecker(module.ast);
    return { ...module, errors: [...module.errors, ...errors] };
  });
};


export const compile = (modules: IModuleDictionary) => {
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
