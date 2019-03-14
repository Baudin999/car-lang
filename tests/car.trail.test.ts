import { transpile } from "../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Define and parser a simple type", () => {
  const source = `

alias Name = String
    | min 2
    | max 45
    | pattern /[A-Z][a-z]*/
    | restricted True

data Maybe a =
    | Just a
    | Nothing

@ Defining a Person is a hell of a job!!
type Person =
    FirstName: Name
    LastName: Maybe Name

`;

  const { cst, ast } = transpile(source);
  //log(cst);
  //log(ast);

  it("should have a test", () => {
    expect(cst).toBeDefined();
  });
});

describe("Let us define an API", () => {
  const source = `

{*
  We define APIs with a Request and a Response, this pattern
  I'll be describing in the following sections will not work
  for push notifications.
*}

type Meta =
    Code: Number
    Message: String

@ code: 404
@ message: Not Found
type Error404 extends Meta

@ code: 500
@ message: Internal Server Error
type Error500 extends Meta


type Envelope req res extends Meta =
    Request: req
    Response: res

type MyAPIRequest =
    Something: String


type MyAPIResponse =
    AccountId: String

alias MyAPI = Envelope MyAPIRequest MyAPIResponse

`;

  const { tokens, cst, ast, errors } = transpile(source);

  //log(errors);
  //log(ast);

  it("should have a test", () => {
    expect(cst).toBeDefined();
  });
});
