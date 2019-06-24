import { DomainLexer } from "./lexer";
import { parser } from "./parser";
import { OutlineVisitor, NodeType, IExpression, IError, IOpen, ErrorType } from "./outline";
import { substituteExtensions, substituteAliases, substitutePluckedFields } from "./substitute";
import { typeChecker } from "./tchecker";
import { IToken } from "chevrotain";
import { IModule } from "./helpers";
import { clone } from "./helpers";

// Modules is the associated hash for looking up module references
// in the other modules (the imports).

// const sanitizeSouce = (source: string): string => {
//   return source.trimRight();
// };

// export const transpile = (source: string): ITranspilationResult => {
//   // clean up the source
//   source = sanitizeSouce(source);

//   // first run, create the AST from the source
//   const { ast, cst, tokens, errors: astErrors } = createAST(source);

//   // now do another pass to update the plucked fields
//   let pluckResult = substitutePluckedFields(ast);
//   let pluckAST = pluckResult.ast;

//   // substitute the references to the aliasses with the actual aliasses
//   let rwAlias = substituteAliases(pluckAST);
//   let rwAliasAST = rwAlias.ast;
//   let rwAliasErrors = rwAlias.errors;

//   // substitute the extensions, here we add the fields which
//   // are added due to the extensions
//   var r = substituteExtensions(rwAliasAST);

//   // type check the whole kaboodle.
//   const checkASTs = typeChecker(r.ast) || [];

//   // generate the errors
//   let fullErrors = [...(astErrors || []), ...rwAliasErrors, ...r.errors, ...checkASTs];

//   // return the result.
//   return {
//     tokens,
//     cst,
//     ast: r.ast,
//     errors: fullErrors
//   };
// };

export const createAST = (source: string) => {
  if (!source || source.length === 0) {
    return {
      ast: {},
      tokens: [],
      cst: []
    };
  }
  let errors: IError[] = [];
  const lexedSource = DomainLexer.tokenize(source);
  parser.input = lexedSource.tokens;
  const cst = parser.START();

  //   // We've removed this in favour of our custom error messages. But
  //   // uncomment if you want to debug something.
  if (parser.errors && parser.errors.length > 0) {
    //console.log(JSON.stringify(parser.errors, null, 4));
    parser.errors.forEach(error => {
      //console.log(error);
      if (error.name === "MismatchedTokenException") {
        let message = error.message;
        if (error.message.indexOf("SIGN_TypeDefStart") > 0) {
          message = `It seems like your field definition is incomplete. We would
have expected something like: 

${(error as any).previousToken.image}: String

But we found an empty type.`;
        }
        errors.push({
          message: message,
          startLineNumber: (error as any).previousToken.startLine,
          endLineNumber: (error as any).previousToken.endLine,
          startColumn: (error as any).previousToken.startColumn,
          endColumn: (error as any).previousToken.endColumn,
          ruleStack: (error as any).context.ruleStack,
          type: ErrorType.MismatchedTokenException
        });
      } else {
        //console.log(parser.input);
        console.log(error);
      }
    });
  }

  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  return { ast, tokens: lexedSource.tokens, cst, errors };
};

export const resolveImports = (modules: IModule[]): IModule[] => {
  return modules.map(module => {
    module.ast
      .filter(node => node.type === NodeType.OPEN)
      .map((node: IOpen) => {
        const m: IModule | undefined = modules.find(m => m.name === node.module);
        if (m === undefined) {
          module.errors.push({
            message: `Could not find module ${node.module} to open`,
            ...node.module_start
          });
        } else {
          node.imports.forEach((id, index) => {
            const ref = getNodeById(id, m.ast || []);
            if (ref) {
              module.ast.unshift(clone(ref, { imported: true }));
            } else {
              module.errors.push({
                message: `Could not find type "${id}" in module ${node.module} to import.`,
                ...node.imports_start[index]
              });
            }
          });
        }
      });
    return module;
  });
};

// export const extensions = (modules: ModuleDictionary) => {
//   return modules.map(module => {
//     let { errors, newAST } = substituteExtensions(module.ast);
//     return { ...module, ast: newAST, errors: [...module.errors, ...errors] } as Module;
//   });
// };

// export const pluck = (modules: ModuleDictionary) => {
//   return modules.map(module => {
//     let { errors, newAST } = substitutePluckedFields(module.ast);
//     return { ...module, ast: newAST, errors: [...module.errors, ...errors] } as Module;
//   });
// };

// export const resolveAlias = (modules: ModuleDictionary) => {
//   return modules.map(module => {
//     const { newAST, errors } = substituteAliases(module.ast);
//     return { ...module, ast: newAST, errors: [...module.errors, ...errors] } as Module;
//   });
// };

// export const typeCheck = (modules: ModuleDictionary) => {
//   return modules.map(module => {
//     let errors = typeChecker(module.ast);
//     return { ...module, errors: [...module.errors, ...errors] } as Module;
//   });
// };

// export const compile = (modules: ModuleDictionary): ModuleDictionary => {
//   return typeCheck(pluck(resolveAlias(extensions(resolveImports(modules)))));
// };

const getNodeById = (id, ast) => {
  return ast.find(node => node.id && node.id === id);
};

export interface ITranspilationResult {
  tokens: IToken[];
  cst: any[];
  ast: IExpression[];
  errors: IError[];
}
