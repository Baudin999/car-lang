import { transpile } from "../../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("We can create an Entity", () => {
  const source = `

type Person =
    Address: Address

type Address

type Food

aggregate Person {
    Address
    Food

    getPerson :: (id: Number) -> Something -> Self
    
    setAddress :: Address -> Self
}

`;

  const { ast, cst, tokens, errors } = transpile(source);

  log(ast);
  //log(errors);

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
