import { transpile } from "../src/transpiler";
import { IType } from "../src/outline";

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

    const { cst, ast, errors } = transpile(source);

    it("Person should have a 'extensions' and it should be 'Customer'", () => {
        expect((ast[1] as IType).extends[0]).toEqual("Customer");
    });
    it("Person should have 4 fields", () => {
        expect((ast[1] as IType).fields.length).toEqual(4);
    });
});

describe("Should be able to extend types", () => {
    const source = `

alias Email = String

type Address =
    Street: String
    Postcode: String
    HouseNumber: String
    HouseNumberExtension: String

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

    const { cst, ast, errors } = transpile(source);

    it("'CorrespondenceAddress' should have 9 fields", () => {
        expect((ast[2] as IType).fields.length).toEqual(9);
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
