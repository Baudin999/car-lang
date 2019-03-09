import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor } from "./../src/outline";

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
  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  // log(parser.errors);
  // log(cst);
  // log(ast);

  it("CST should be defined", () => {
    expect(cst).toBeDefined();
  });
});

describe("An alias type", () => {
  const source = `

alias Foo = Something String

`;
  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  //log(parser.errors);
  //log(cst);
  //log(ast);

  it("CST should be defined", () => {
    expect(cst).toBeDefined();
  });
});

describe("A simple Data object", () => {
  const source = `

data Maybe a =
  | Just a
  | Nothing

`;
  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  //log(parser.errors);
  //log(cst);
  //log(ast);

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
  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  // log(parser.errors);
  // log(cst);
  // log(ast);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
    expect(cst.children.EXPRESSION.length).toEqual(4);
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
  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  // log(parser.errors);
  // log(cst);
  // log(ast);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
    expect(cst.children.EXPRESSION.length).toEqual(3);
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
  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  // log(parser.errors);
  // log(cst);
  //log(ast);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
    expect(cst.children.EXPRESSION.length).toEqual(7);
  });
});

describe("Concrete values and partially applied constructor functions", () => {
  /*
  A little bit of context:
  Pushing a concrete value as the generic parameter instead of
  a type results in a concrete type and a partially applied
  constructor function.

  so, in TypeScript, the constructor for Kelkboompjes looks like:

  const Person = (firstName: string, lastName: string) : Person => {
    return {
      FirstName: firstName,
      LastName: lastName
    };
  };

  const Kelkboompjes = (firstName:string) : Person => {
    return {
      FirstName: firstName,
      LastName: "Kelkboom"
    };
  };

  */

  const source = `

alias Kelkboompjes = Person "Kelkboom"

type Person a =
  FirstName: String
  LastName: a


`;
  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);
  // log(parser.errors);
  // log(cst);
  //log(ast);

  it("Check the validity of the cst", () => {
    expect(cst).toBeDefined();
    expect(cst.children.EXPRESSION.length).toEqual(2);
    //log(cst.children.EXPRESSION[0]);
  });
});
