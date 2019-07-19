import { IType, NodeType, IAlias, IData } from "../src/outline";
import { Module } from "./../src/Module";
import { fakeConfig, fakeModule } from "./fakes";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

/**
# Types

In the `car` language types are defined like this:

```car
type Person =
    FirstName: String
    LastName: String
```

As you can see we can extract the following rules:

1.  Types always start with a capital letter.
2.  A `type` can be seen as a record type in Haskell
3.  The type a key has is always placed after the `:` colon.
4.  Fields begin with an indent of 4 spaces.
5.  Fields have a name "id" and a type.

There are

- String
- Char
- Number
- Boolean
- Date
- Time
- DateTime
 */
describe("Define and parser a simple type", () => {
  const source = `

type Person =
    FirstName: String
        & max 20
    LastName: String

`;

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast).toBeDefined();
    next();
  });
});

describe("Errors for incomplete field definitions", () => {
  const source = `

type Person =
    FirstName

`;

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
    next();
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

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast).toBeDefined();
    next();
  });
});

describe("Should be able to extend types", () => {
  const source = `

type Customer =
    CustomerId: Number

type Person extends Customer =
    FirstName: String
    LastName: String
    Email: String

type Company extends Customer =
    KvK: String

`;

  it("We should be able to compile", async next => {
    let { ast, errors } = await fakeModule(source);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
    expect((ast[1] as IType).extends[0]).toEqual("Customer");
    expect((ast[1] as IType).fields.length).toEqual(4);
    next();
  });
});

describe("Should be able to extend types", () => {
  const source = `

alias Email = String

type Address =
    Street: String
    Postcode: String
    HouseNumber: String
    HouseNumberExtension: Maybe String

type CorrespondenceAddress extends Address, Correspondence =
    Active: Boolean
    @ The name to put on the letter.
    CareOfFullName: String
    PoBox: String

type EmailCorrespondence extends Correspondence =
    Email: String

type PhoneCorrespondence extends Correspondence =
    Phone: String

@ How to contact the Customer.
type Correspondence =
    From: Date
    To: Maybe Date


`;

  it("'CorrespondenceAddress' should have 9 fields", async next => {
    let { ast, errors } = await fakeModule(source);
    expect((ast[2] as IType).fields.length).toEqual(9);
    next();
  });
});

describe("Alias with restrictions", () => {
  const source = `

alias Name = String
    & min 2
    & max 10
    & pattern /[A-Z]\w{19}/

`;

  it("We should be able to tokenize", async next => {
    let { ast, errors } = await fakeModule(source);
    expect(ast[0].type).toEqual(NodeType.ALIAS);
    let alias = ast[0] as IAlias;
    expect(alias.restrictions.length).toEqual(3);
    next();
  });
});

describe("Define a generic type", () => {
  const source = `

data Maybe a =
    | Just a
    | Nothing

`;

  it("We should be able to tokenize", async next => {
    let { ast, errors } = await fakeModule(source);
    expect(ast[0].type).toEqual(NodeType.DATA);
    let data = ast[0] as IData;
    expect(data.id).toEqual("Maybe");
    expect(data.params).toBeDefined();
    expect((data.params as string[])[0]).toEqual("a");
    expect(data.options.length).toEqual(2);
    expect(data.options[0].id).toEqual("Just");
    expect(data.options[0].params).toBeDefined();
    expect((data.options[0].params as string[])[0]).toEqual("a");
    expect(data.options[1].id).toEqual("Nothing");
    next();
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

  it("We should be able to tokenize", async next => {
    let { ast, errors } = await fakeModule(source);
    expect(ast[0].type).toEqual(NodeType.DATA);
    let data = ast[0] as IData;
    expect(data.id).toEqual("Maybe");
    expect(data.params).toBeDefined();
    expect((data.params as string[])[0]).toEqual("a");
    expect(data.options.length).toEqual(2);
    expect(data.options[0].id).toEqual("Just");
    expect(data.options[0].params).toBeDefined();
    expect((data.options[0].params as string[])[0]).toEqual("a");
    expect(data.options[1].id).toEqual("Nothing");
    next();
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
      message: 'Cannot find type "Foo" of field "LastName" of type "Person"',
      startLineNumber: 5,
      endLineNumber: 5,
      startColumn: 15,
      endColumn: 18,
      type: "FieldTypeUndefined"
    },
    {
      message: 'Cannot find type "Bar" of field "LastName" of type "Person"',
      startLineNumber: 5,
      endLineNumber: 5,
      startColumn: 19,
      endColumn: 22,
      type: "ParameterTypeUndefined"
    },
    {
      message: 'Cannot find type "Result" of field "LastName" of type "Person"',
      startLineNumber: 5,
      endLineNumber: 5,
      startColumn: 23,
      endColumn: 29,
      type: "ParameterTypeUndefined"
    }
  ];

  it("We should be able to tokenize", async next => {
    let { ast, errors } = await fakeModule(source);
    expect(errors.length).toBe(3);
    errors.forEach((error, i) => {
      for (var key in error) {
        expect(errors[i][key]).toEqual(errorResults[i][key]);
      }
    });
    next();
  });

  // const { ast, errors } = transpile(source);

  // it("We should be able to tokenize", () => {
  //   expect(ast).toBeDefined();
  //   expect(errors).toBeDefined();
  //   expect(errors.length).toEqual(3);
  //   errors.forEach((error, i) => {
  //     for (var key in error) {
  //       expect(errors[i][key]).toEqual(errorResults[i][key]);
  //     }
  //   });
  // });
});
