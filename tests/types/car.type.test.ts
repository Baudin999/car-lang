import { fakeModule } from "./../fakes";
import { IType, ITypeField } from "../../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Define an empty type", () => {
  const source = `

type Person

`;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(0);
    expect(ast.length).toEqual(1);

    let personASTNode = ast[0] as IType;
    expect(personASTNode.id).toEqual("Person");
  });
});

describe("Define annotations on the type", () => {
  const source = `
  
@ This is a general description annotation
@ the description can be multi-line.
@ key: value
type Person
  
  `;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(0);
    expect(ast.length).toEqual(1);

    let personASTNode = ast[0] as IType;
    expect(personASTNode.id).toEqual("Person");
    expect(personASTNode.annotations.length).toEqual(2);
    expect(personASTNode.annotations[0].key).toEqual("description");
    expect(personASTNode.annotations[0].value).toEqual(
      "This is a general description annotation the description can be multi-line."
    );
  });
});

describe("Define annotations on the type", () => {
  const source = `
    
@ This is a general description annotation
@ the description can be multi-line.
@ key: value
type Person =
    FirstName: String

    `;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(0);
    expect(ast.length).toEqual(1);

    let personASTNode = ast[0] as IType;
    expect(personASTNode.id).toEqual("Person");
    expect(personASTNode.annotations.length).toEqual(2);
    expect(personASTNode.annotations[0].key).toEqual("description");
    expect(personASTNode.annotations[0].value).toEqual(
      "This is a general description annotation the description can be multi-line."
    );
  });
});

describe("The type of a field should be defined or throw an error", () => {
  const source = `

type Person =
    FirstName: PersonFirstName

    `;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
  });
});

describe("We can extend types", () => {
  it("Should just work", async () => {
    const source = `
    
type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date
    
type Person extends Human =
    CallingName: String
    
    `;

    let { cst, ast, errors, tokens } = await fakeModule(source);

    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(0);
    expect(ast.length).toEqual(2);

    expect((ast[0] as IType).fields.length).toEqual(4);
    expect((ast[1] as IType).fields.length).toEqual(5);
  });

  it("We can't extend if the type does not exist", async () => {
    const source = `

type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person extends Human, Ironman, Hulk =
    CallingName: String

      `;

    let { cst, ast, errors, tokens } = await fakeModule(source);

    expect(errors.length).toEqual(2);
  });
});

describe("We can pluck fields from types", () => {
  const source = `

type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person =
    pluck Human.FirstName
    CallingName: String

      `;

  it("Should work", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);

    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });
});

describe("We can pluck and rename fields from types", () => {
  const source = `

type Human =
    FirstName: Maybe String
        & min 10
        & max 90
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person =
    @ This is an annotation for the FuurstName
    @ The FuurstName comes from the "Human" type
    FuurstName: Human.FirstName
        & min 12
        & other "foo"
    CallingName: String

      `;

  it("Should work", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);

    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();

    let personType = ast[1] as IType;
    let fuurstNameField = personType.fields[0] as ITypeField;
    expect(fuurstNameField.id).toEqual("FuurstName");
    expect(fuurstNameField.ofType).toEqual("Maybe");
    expect(fuurstNameField.ofType_params[0]).toEqual("String");
  });
});

/* RECURSION */

describe("A complex recursive example", () => {
  const source = `

alias Author = String
    & pattern /[A-Z][a-z]* [[A-Z][a-z]*]/

type FileInfo =
    Name: String
    Size: Number
    LastModified: String
    FullPath: String
    CreatedBy: Author
    ModifiedBy: Author

type DirectoryInfo =
    Name: String
    Children: List FileSystemInfo
    CreatedBy: Author

data FileSystemInfo =
    | FileInfo
    | DirectoryInfo

      `;

  it("Should work", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);

    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });
});
