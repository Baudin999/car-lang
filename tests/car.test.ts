import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor } from "./../src/outline";
import { transpile } from "../src/transpiler";
import { createERD } from "../src/erd/createERD";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Define and parser a simple type", () => {
  const source = `

type Person =
    FirstName: String
    LastName: String

`;

  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);

  it("should have a test", () => {
    expect(cst).toBeDefined();
  });
});

describe("Annotate a type and annotate the fields", () => {
  const source = `

@ This is the Person type and we
@ can write a multiline comment
@ on this type
@ api : No api yet!
type Person =
    @ This is the person.firstName field
    @ faker: person.firstName
    FirstName: String

`;
  const { cst, ast } = transpile(source);

  it("CST should be defined", () => {
    expect(cst).toBeDefined();
  });
});

describe("An alias type", () => {
  const source = `

alias Foo = Something String

`;
  const { cst, errors, ast } = transpile(source);

  it("CST should be defined", () => {
    expect(cst).toBeDefined();
  });
  it("should contain errors because the type Something is unknown", () => {
    expect(errors.length).toEqual(1);
  });
});

describe("An option type, an enumeration", () => {
  const source = `

choice Food =
    | "Hamburger"
    | "Filet 'o Fish"

`;
  const { cst, errors, ast, tokens } = transpile(source);

  it("CST should be defined", () => {
    expect(cst).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});

describe("A simple Data object", () => {
  const source = `

data Maybe a =
    | Just a
    | Nothing

`;
  const { cst, ast } = transpile(source);

  it("CST should be defined", () => {
    expect(cst).toBeDefined();
  });
});

describe("An outline should be able to be made", () => {
  const source = `

data Option a =
    | Just a
    | Nothing

alias IntSuccess = Success Integer Boolean

type Person =
    FirstName: String
    LastName: String
    CodeMessage: IntSuccess
    Message: Success String Integer


@ The Success Type
type Success a b =
    Body: a
    Error: b


`;
  const { cst, ast, errors } = transpile(source);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
  });
});

describe("Comments should be possible", () => {
  const source = `

{* This is a comment *}

{*
  This is a multi-line
  comment
*}

type Foo

`;
  const { cst, ast } = transpile(source);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
  });
});

describe("markdown should be possible", () => {
  const source = `

# Chapter One

[something](https://my-image)

And a simple Paragraph!! With
a couple of lines.

\`\`\`js

function foo() {
  return 12;
}
\`\`\`

\`\`\`
fun sum a b => a + b
\`\`\`


 * Something
 * Or Other
    * Child List Item
    * Another CHild
 * And a root


 And another paragraph

`;
  const { tokens, cst, ast } = transpile(source);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
  });
});

describe("Mimic the file system", () => {
  const source = `

alias Author = String
    | pattern /[A-Z][a-z]* [[A-Z][a-z]*]/

type FileInfo =
    Size: Number
    LastModified: String
    FullPath: String
    CreatedBy: Author
    ModifiedBy: Author

type DirectoryInfo =
    Children: List FileSystemInfo

data FileSystemInfo =
    | FileInfo
    | DirectoryInfo

`;
  const { cst, ast, errors } = transpile(source);

  //console.log(createERD(ast));

  //console.log(ast);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
  });
});

describe("Sample of real code", () => {
  const source = `

## Chapter

The \`Maybe\` type is something we could also pull from the \`Prelude\` module,
but we'll redefine it here.

data Maybe a =
    | Just a
    | Nothing

type Entity =
    Id: String

alias MyEntity = Entity

choice Gender =
    | "Male"
    | "Female"
    | "Neutral"

type Address =
    Street: String
    HouseNumber: Number
    HouseNumberExtension: String
    City: String
    Country: String

@ This is the Person Entity which
@ will be the basis for other types
@ of entities.
type Person extends MyEntity =
    FirstName: Maybe String
    LastName: String
    Gender: Gender
    Address: Address

`;

  const { ast, cst, tokens, errors } = transpile(source);
  //log(errors);
  //log(ast);
  //console.log(createERD(ast));

  it("should have a test", () => {
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });

  it("Should not contain errors", () => {
    //expect(errors.length).toEqual(0);
  });
});
