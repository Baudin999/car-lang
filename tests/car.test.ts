import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor } from "./../src/outline";
import { transpile } from "../src/transpiler";

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
