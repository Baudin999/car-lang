import { transpile } from "../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Define and parser a simple type", () => {
  const source = `

type Person =
    FirstName: String
        | max 20
    LastName: String

`;

  const { cst, ast, errors } = transpile(source);

  it("We should be able to tokenize", () => {
    expect(ast).toBeDefined();
  });
});

describe("Pluck fields from other types", () => {
  const source = `

type Person =
    FirstName: String
    LastName: String
    Email: String

type Account =
    UserName: String
    Password: String
    pluck Person.Email

`;

  const { cst, ast, errors } = transpile(source);

  it("We should be able to tokenize", () => {
    expect(ast).toBeDefined();
  });
});

describe("Alias with a restriction", () => {
  const source = `

alias Name = String
    | min 2
    | max 10
    | pattern /[A-Z]\w{19}/

`;

  const { cst, tokens, ast, errors } = transpile(source);
  it("We should be able to tokenize", () => {
    expect(ast).toBeDefined();
  });
});

describe("Define a generic type", () => {
  const source = `

data Maybe a =
    | Just a
    | Nothing

`;

  const { ast, errors } = transpile(source);

  it("We should be able to tokenize", () => {
    expect(ast).toBeDefined();
  });
});

describe("Define a generic type and use it in a type", () => {
  const source = `

data Maybe a =
    | Just a
    | Nothing

type Person =
    FirstName: Maybe String
    LastName: String

`;

  const { ast, errors } = transpile(source);

  it("We should be able to tokenize", () => {
    expect(ast).toBeDefined();
  });
});

describe("Let's generate some errors", () => {
  const source = `

type Person =
    FirstName: Maybe String
    LastName: Foo Bar Result String

`;
  const errorResults = [
    {
      message: 'Cannot find type "Maybe" of field "FirstName" of type "Person"',
      startLineNumber: 4,
      endLineNumber: 4,
      startColumn: 16,
      endColumn: 21
    },
    {
      message: 'Cannot find type "Foo" of field "LastName" of type "Person"',
      startLineNumber: 5,
      endLineNumber: 5,
      startColumn: 15,
      endColumn: 18
    },
    {
      message: 'Cannot find type "Bar" of field "LastName" of type "Person"',
      startLineNumber: 5,
      endLineNumber: 5,
      startColumn: 19,
      endColumn: 22
    },
    {
      message: 'Cannot find type "Result" of field "LastName" of type "Person"',
      startLineNumber: 5,
      endLineNumber: 5,
      startColumn: 23,
      endColumn: 29
    }
  ];

  const { ast, errors } = transpile(source);

  it("We should be able to tokenize", () => {
    expect(ast).toBeDefined();
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(4);
    errors.forEach((error, i) => {
      for (var key in error) {
        expect(errors[i][key]).toEqual(errorResults[i][key]);
      }
    });
  });
});
