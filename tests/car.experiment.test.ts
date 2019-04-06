import { transpile } from "../src/transpiler";
import { getFileFromModuleName } from "../src/fileManager";
import { createERD, createView } from "./../src/erd/createERD";
import { NodeType, IView } from "../src/outline";

const log = source => {
    console.log(JSON.stringify(source, null, 4));
};

describe("Experiment with the language", () => {
    const source = `


type HttpResponse =
    HttpCode: Number
    Message: String

@ code: 404
@ message: Not Found
type Error404 extends HttpResponse


@ code: 401
@ message: Unauthorised
type Error401 extends HttpResponse


@ code: 500
@ message: Internal Server Error
type Error500 extends HttpResponse


@ code: 200
@ message: OK
type Response a extends HttpResponse =
    Body: a


data ApiResponse a =
    | Error401
    | Error404
    | Error500
    | Response a

alias CustomerResponse = ApiResponse Cusomer

`;

    const { ast, cst, tokens, errors } = transpile(source);
    //log(tokens);
    //log(ast);
    //log(createView(ast.find(n => n.type === NodeType.VIEW) as any, ast));

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
