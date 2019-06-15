import { transpile } from "../../src/transpiler";
import { IType } from "../../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

/**

# Empty Types

An empty type is a type which only has a name. This means that
the type has no fields but it does have meaning.

```
type Person
```

If we want to take it one step further and also define a few value 
objects for this type we can go ahead and define them. The `car-lang`
had a few base types you can use:

 * "String"
 * "Char"
 * "Integer"
 * "Number"
 * "Decimal"
 * "Double"
 * "Boolean"
 * "Date"
 * "Time"
 * "DateTime"


```
type Person =
    FirstName: String
```

Remember to always use 4 spaces or a single tab to indent. 

 */

describe("Define an empty type", () => {
  const source = `

type Person

`;

  const { cst, errors, ast, tokens } = transpile(source);

  it("CST should be defined", () => {
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

  const { cst, errors, ast, tokens } = transpile(source);

  it("CST should be defined", () => {
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

  const { cst, errors, ast, tokens } = transpile(source);

  it("CST should be defined", () => {
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

  const { cst, errors, ast, tokens } = transpile(source);

  it("CST should be defined", () => {
    expect(errors).toBeDefined();
    expect(errors.length).toEqual(1);
  });
});

describe("We can pluck fields from types", () => {
  const source = `

type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person extends Human =
    CallingName: String

      `;

  const { cst, errors, ast, tokens } = transpile(source);

  expect(cst).toBeDefined();
  expect(ast).toBeDefined();
  expect(tokens).toBeDefined();
  expect(errors).toBeDefined();
  expect(errors.length).toEqual(0);
  expect(ast.length).toEqual(2);

  expect((ast[0] as IType).fields.length).toEqual(4);
  expect((ast[1] as IType).fields.length).toEqual(5);
});
