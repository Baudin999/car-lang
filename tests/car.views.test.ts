import { IType, NodeType, IAlias, IData, IView } from "../src/outline";
import { Module } from "./../src/Module";
import { fakeConfig, fakeModule } from "./fakes";

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

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(errors.length).toEqual(0);
    expect(ast).toBeDefined();
    expect(ast.length).toEqual(4);
    expect(ast[3].type).toEqual(NodeType.VIEW);
    let view = ast[3] as IView;
    expect(view.directives.length).toEqual(2);
    expect(view.directives[0].key).toEqual("title");
    expect(view.directives[0].value).toEqual("Person View");
    expect(view.nodes.length).toEqual(1);
    expect(view.nodes[0]).toEqual("Person");
    next();
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

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast).toBeDefined();
    expect(errors.length).toBe(2);
    next();
  });
});
