import { transpile } from "../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Define a simple view", () => {
  const source = `

data Maybe a =
    | Just a
    | Nothing

type Person =
    FirstName: String
    LastName: Maybe String
    Address: Address

type Address =
    Street: String
    PostalCode: String
    HouseNumber: Number
    HouseNumberExtension: String
    City: String
    CountryCode: String
        | length 2
    Country: Maybe String


view PersonView {
    
    % title: Person View
    % depth: 0

    Person
}

`;

  const { tokens, errors, ast } = transpile(source);

  it("AST should be defined", () => {
    expect(ast).toBeDefined();
  });
});

describe("The View should only have nodes which are known", () => {
  const source = `

view PersonView {
    Person
    Address
    Contracts
}

type Address 

`;

  const { tokens, errors, ast } = transpile(source);

  it("Errors should be of length 2", () => {
    expect(errors.length).toEqual(2);
  });
});
