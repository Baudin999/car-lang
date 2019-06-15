import { transpile } from "../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("We should be able to create guidelines", () => {
  const source = `

guideline {
    % title: We create RESTful APIs
    % subject: REST
    % version: 1

    # Header

    This is some content belonging to the guideline.

    We can add as much markdown we want.
}

`;

  const { cst, ast, errors } = transpile(source);

  //log(ast);

  it("We should be able to tokenize", () => {
    expect(ast).toBeDefined();
  });
});
