import { fakeModule } from "./fakes";
import { IType, ITypeField } from "../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Define and parser a simple type", () => {
  const source = `

type Person =
    FirstName: String
    LastName: String

type Customer = 
    Id: String

type Foo extends Person Customer

`;

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(errors.length).toEqual(0);
    expect(ast).toBeDefined();
    let foo = ast[2] as IType;
    expect(foo.fields.length).toBe(3);
    expect((foo.fields[0] as ITypeField).id).toEqual("FirstName");
    expect((foo.fields[1] as ITypeField).id).toEqual("LastName");
    expect((foo.fields[2] as ITypeField).id).toEqual("Id");
    next();
  });
});

describe("Extension types must be defined", () => {
  const source = `
  
type Foo extends Person Customer
  
  `;

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(errors.length).toEqual(2);

    next();
  });
});

describe("Pluck a type from a parent type", () => {
  const source = `

type Entity =
    Id: Number

type Person =
    FirstName: String

type APIPerson extends Person, Entity

type BackendPerson =
    pluck APIPerson.FirstName

`;
  it("Should have the type inherited from the parent", async () => {
    let { ast, errors } = await fakeModule(source);

    expect(errors.length).toEqual(0);
  });
});
