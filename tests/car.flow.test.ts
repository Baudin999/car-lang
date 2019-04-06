import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor } from "../src/outline";

/*
FLOWS

A Flow describes how data will flow from one system to the next. A
flow is described the same way function types are defined in Haskell,
Elm, PureScript or other pure functional languages.

getBook :: BookName -> Book

Contrary to the languages like Haskell, car-lang does not implement 
real code. This means that we need to be more creative and more 
descriptive in our way of writing our flows. We can add parameter names
to the flow definitions in a style comparable to TypeScript:

getBook :: (name: BookName) -> (print: PrintVersion) -> Book

Car-lang will transpile these flows into PlantUML sequence diagrams.

*/

const log = source => {
    console.log(JSON.stringify(source, null, 4));
};

describe("Should be able to define an aggregate", () => {
    const source = `

flow {
    % title: Book Operations

    @ source: Entity Service
    @ target: SAP
    getBook :: BookName -> (name: String) -> Other -> Book

    findBooks :: String -> List Books
}

`;

    const tokenStream = DomainLexer.tokenize(source);
    parser.input = tokenStream.tokens;
    const cst = parser.START();
    const visitor = new OutlineVisitor();
    const ast = visitor.visit(cst);

    //log(parser.errors);
    //log(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});
