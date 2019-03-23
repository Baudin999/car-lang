import { transpile } from "../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Annotations should be possible on a type and the fields", () => {
  const source = `

@ This is a multiline annotation
@ Which should just work
type Person =
    FirstName: String
    @ This is the last name
    @ type: String
    LastName: String

`;

  const { tokens, errors, ast } = transpile(source);
  //log(tokens);
  //log(cst);
  log(ast);
  //log(errors);

  it("AST should be defined", () => {
    expect(ast).toBeDefined();
  });
});
