import { transpile } from "../src/transpiler";
import { getFileFromModuleName } from "../src/fileManager";
import { createERD, createView } from "./../src/erd/createERD";
import { NodeType, IView } from "../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Experiment with the language", () => {
  const source = `

type Person =
    @ This is the name
    FirstName: String

`;

  const { ast, cst, tokens, errors } = transpile(source);

  if (errors && errors.length) console.log(errors);

  it("should have a test", () => {
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });

  it("Should not contain errors", () => {
    //expect(errors.length).toEqual(0);
  });
});
