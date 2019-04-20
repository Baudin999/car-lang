import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor } from "./../src/outline";
import { transpile } from "../src/transpiler";
import { createERD } from "../src/erd/createERD";

const log = source => {
    console.log(JSON.stringify(source, null, 4));
};

/**
 * MAPs are simple flows which you can use to design
 * simple mind-maps and data flows.
 */
describe("Define and parser a simple type", () => {
    const source = `

map {
    Foo -> Bar -> "Or other thing I'd like to see" -> Something

    Something -> Foo

    Foo -> Other
}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(ast);

    it("should have a test", () => {
        expect(cst).toBeDefined();
        expect(ast).toBeDefined();
    });
});
