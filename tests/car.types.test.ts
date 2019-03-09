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

  it("We should be able to tokenize", () => {
    expect(tokenStream).toBeDefined();
    expect(tokenStream.errors.length).toEqual(0);
  });
});

describe("Define a generic type", () => {
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

  it("We should be able to tokenize", () => {
    expect(tokenStream).toBeDefined();
    expect(tokenStream.errors.length).toEqual(0);
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

  const tokenStream = DomainLexer.tokenize(source);
  parser.input = tokenStream.tokens;
  const cst = parser.START();
  const visitor = new OutlineVisitor();
  const ast = visitor.visit(cst);

  it("We should be able to tokenize", () => {
    expect(tokenStream).toBeDefined();
    expect(tokenStream.errors.length).toEqual(0);
  });
});
