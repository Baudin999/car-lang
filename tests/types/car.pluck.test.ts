import { fakeModule } from "./../fakes";
import { IType, ITypeField, ErrorType } from "../../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Pluck a type", () => {
  const source = `

type Person =
    FirstName: String

type APIPerson =
    pluck Person.FirstName

`;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(0);
    expect(ast.length).toEqual(2);

    let personASTNode = ast[1] as IType;
    expect(personASTNode.id).toEqual("APIPerson");
    expect(personASTNode.fields.length).toEqual(1);
    expect((personASTNode.fields[0] as any).id).toEqual("FirstName");
    expect((personASTNode.fields[0] as any).ofType).toEqual("String");
  });
});

describe("Pluck a type and rename the field", () => {
  const source = `

type Person =
    FirstName: String

type APIPerson =
    FooName: Person.FirstName

`;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(0);
    expect(ast.length).toEqual(2);

    let personASTNode = ast[1] as IType;
    expect(personASTNode.id).toEqual("APIPerson");
    expect(personASTNode.fields.length).toEqual(1);
    expect((personASTNode.fields[0] as any).id).toEqual("FooName");
    expect((personASTNode.fields[0] as any).ofType).toEqual("String");
  });
});

describe("Pluck a type and rename the field", () => {
  const source = `

type Person =
    FirstName: String

type APIPerson =
    pluck Person.LastName

`;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(errors.length).toEqual(1);
    expect(errors[0].type === ErrorType.PluckedFieldUnknown);
  });
});

describe("Pluck a type from a parent type", () => {
  const source = `

type Person =
    FirstName: String

type APIPerson extends Person

type BackendPerson =
    pluck APIPerson.FirstName

`;
  it("Should have the type inherited from the parent", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(errors.length).toEqual(0);
  });
});
