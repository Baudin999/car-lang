import { transpile } from "../src/transpiler";
import { createERD } from "./../src/erd/createERD";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Experiment with the language", () => {
  const source = `


data Maybe a =
    | Just a
    | Nothing


data List a =
    | List a
    | Nil

type Branch a =
    Left: a
    Value: a
    Right: a

data Tree a =
    | Nil
    | Branch a


`;

  const { ast, cst, tokens, errors } = transpile(source);
  //log(errors);
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
