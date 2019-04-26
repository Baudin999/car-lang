import { transpile } from "../src/transpiler";
import { IType } from "../src/outline";

const log = source => {
    console.log(JSON.stringify(source, null, 4));
};

describe("Define and parser a simple type", () => {
    const source = `

type Person =
    FirstName: String
    LastName: String

type Customer = 
    Id: String

type Foo extends Person Customer

`;

    const { cst, ast, errors } = transpile(source);

    //log(ast[2]);

    it("We should be able to tokenize", () => {
        expect(ast).toBeDefined();
    });
});
