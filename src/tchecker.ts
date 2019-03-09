/**
 * This is the type checker. We're going to do "soft" type checking
 * because this tool will mostly be used to do some very soft designing
 * and should not be used in a "hard" environment.
 *
 * Eventually we'll want to do things like code generation, auto-completion
 * plucking of types and most of all show where a change will have impact,
 * so impact analysis and general "tree shaking".
 *
 * Severity can be:
 * 1: "Hint", 2: "Info", 4: "Warning", 8: "Error"
 *
 *
 * @param {AST} ast
 */
export const typeChecker = (ast = []) => {
  return ast
    .filter((node: any) => node._type === "ALIAS")
    .map((node: any) => ({
      ...node.tokens.start,
      severity: 4,
      message: "Unused alias."
    }));
};
