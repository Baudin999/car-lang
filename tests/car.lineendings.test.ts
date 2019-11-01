import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor } from "./../src/outline";
import { fakeModule } from "./fakes";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Define and parser a simple type", () => {
  const source = `

type Person =
    FirstName: String
    LastName: String

alias Carlos = Person;    

  `.replace(/!\r\n/, "\r\n");

  it("should have a test", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
    expect(ast.length).toEqual(2);
    expect((ast[1] as any).fields.length).toEqual(2);
  });
});
