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
    %%
     This is the personview, a view is always for an audience.
     As you can see, this is the easiest way to add multiline
     comments and descriptions to a view.
    %%

    Person
}

`;

  const { tokens, errors, ast } = transpile(source);
  //log(tokens);
  //log(cst);
  //log(ast);
  //log(errors);

  it("AST should be defined", () => {
    expect(ast).toBeDefined();
  });
});
