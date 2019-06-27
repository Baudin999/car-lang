"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer");
const parser_1 = require("./parser");
const outline_1 = require("./outline");
const helpers_1 = require("./helpers");
exports.createAST = (source) => {
    if (!source || source.length === 0) {
        return {
            ast: {},
            tokens: [],
            cst: []
        };
    }
    let errors = [];
    const lexedSource = lexer_1.DomainLexer.tokenize(source);
    parser_1.parser.input = lexedSource.tokens;
    const cst = parser_1.parser.START();
    //   // We've removed this in favour of our custom error messages. But
    //   // uncomment if you want to debug something.
    if (parser_1.parser.errors && parser_1.parser.errors.length > 0) {
        //console.log(JSON.stringify(parser.errors, null, 4));
        parser_1.parser.errors.forEach(error => {
            //console.log(error);
            if (error.name === "MismatchedTokenException") {
                let message = error.message;
                if (error.message.indexOf("SIGN_TypeDefStart") > 0) {
                    message = `It seems like your field definition is incomplete. We would
have expected something like: 

${error.previousToken.image}: String

But we found an empty type.`;
                }
                errors.push({
                    message: message,
                    startLineNumber: error.previousToken.startLine,
                    endLineNumber: error.previousToken.endLine,
                    startColumn: error.previousToken.startColumn,
                    endColumn: error.previousToken.endColumn,
                    ruleStack: error.context.ruleStack,
                    type: outline_1.ErrorType.MismatchedTokenException
                });
            }
            else {
                //console.log(parser.input);
                console.log(error);
            }
        });
    }
    const visitor = new outline_1.OutlineVisitor();
    const ast = visitor.visit(cst);
    return { ast, tokens: lexedSource.tokens, cst, errors };
};
exports.resolveImports = (modules) => {
    return modules.map(module => {
        module.ast
            .filter(node => node.type === outline_1.NodeType.OPEN)
            .map((node) => {
            const m = modules.find(m => m.name === node.module);
            if (m === undefined) {
                module.errors.push(Object.assign({ message: `Could not find module ${node.module} to open` }, node.module_start));
            }
            else {
                node.imports.forEach((id, index) => {
                    const ref = getNodeById(id, m.ast || []);
                    if (ref) {
                        module.ast.unshift(helpers_1.clone(ref, { imported: true }));
                    }
                    else {
                        module.errors.push(Object.assign({ message: `Could not find type "${id}" in module ${node.module} to import.` }, node.imports_start[index]));
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
//# sourceMappingURL=transpiler.js.map