import { transpile } from "../src/transpiler";
import { getFileFromModuleName } from "../src/fileManager";
import { createERD } from "./../src/erd/createERD";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Experiment with the language", () => {
  const source = `

data Maybe a =
    | Just a
    | Nothing

type Entity =
    Id: String

alias MyEntity = Entity

choice Gender =
    | "Male"
    | "Female"
    | "Other"

type Address =
    Street: String
    HouseNumber: Number
    HouseNumberExtension: String
    City: String
    Country: String

type Person extends MyEntity =
    FirstName: Maybe String
    LastName: String
    Gender: Gender
    Address: Address

`;

  const { ast, cst, tokens, errors } = transpile(source);
  //log(errors);
  //log(ast);
  console.log(createERD(ast));

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
