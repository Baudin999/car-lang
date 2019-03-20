import { transpile } from "../src/transpiler";
import { getFileFromModuleName } from "../src/fileManager";
import { createERD } from "./../src/erd/createERD";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Experiment with the language", () => {
  const source = `

let foo = 12

`;

  const { ast, cst, tokens, errors } = transpile(source);
  //log(tokens);
  //log(ast);
  //console.log(createERD(ast));

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
