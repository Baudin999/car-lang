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
    Address: Address

type Address =
    Street: String

view {
    Person
}

`;

  const { ast, cst, tokens, errors } = transpile(source);
  //log(tokens);
  //log(ast);
  //log(createView(ast.find(n => n.type === NodeType.VIEW) as any, ast));

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
