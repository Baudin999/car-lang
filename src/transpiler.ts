import { DomainLexer } from "./lexer";
import { parser } from "./parser";
import { OutlineVisitor, NodeType, IExpression, IError, IOpen, ErrorType } from "./outline";
import { IToken } from "chevrotain";
import { IModule } from "./helpers";
import { clone } from "./helpers";

export const createAST = (source: string) => {
  source = source.replace(/\r\n/, "\n");
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
      // It's either this or casting before each property call.
      const anyErr = error as any;

      // If properties are empty, replace them with -1 to indicate an unknown value.
      let shownError = {
        message: "",
        startLineNumber: anyErr.previousToken ? anyErr.previousToken.startLine : -1,
        endLineNumber: anyErr.previousToken ? anyErr.previousToken.endLine : -1,
        startColumn: anyErr.previousToken ? anyErr.previousToken.startColumn : -1,
        endColumn: anyErr.previousToken ? anyErr.previousToken.endColumn : -1,
        ruleStack: anyErr.context ? anyErr.context.ruleStack : "no context"
      };

      // Message is determined by the type of exception.
      let message = "Undetermined";

      // In case a field has been declared without a type
      if (error.name === "MismatchedTokenException") {
        message = error.message;
        if (error.message.indexOf("SIGN_TypeDefStart") > 0) {
          message = `It seems like your field definition is incomplete. We would have expected something like: 
            ${(error as any).previousToken.image}: String
            But we found an empty type.`;
        }
        shownError.message = message;
      } else if (error.name === "NoViableAltException") {
        // In case of something like a malformed regex pattern.
        const searchFor = "but found:";
        // Take the original error message and only show the unrecognised text.
        const append = error.message.substr(
          error.message.indexOf(searchFor) + searchFor.length,
          error.message.length
        );
        message = `Unexpected token(s) encountered: ${append}`;
      } else {
        // Unknown error, so dump everything. Remove the console.error if you want a 'cleaner' console.
        // This will add some 20 lines in the console.
        console.error(error);
        message = "Unknown transpilation error occurred, complete error dumped.";
      }
      shownError.message = message;
      // Add error to list that the module uses. Module will handle the rest.
      errors.push(shownError);
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
          if (node.imports) {
            node.imports.forEach((id, index) => {
              const ref = getNodeById(id, m.ast || []);
              if (ref) {
                module.ast.unshift(clone(ref, { imported: true }));
              } else if (node.imports_start) {
                module.errors.push({
                  message: `Could not find type "${id}" in module ${node.module} to import.`,
                  ...node.imports_start[index]
                });
              }
            });
          } else module.ast = [...m.ast, ...module.ast];
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
