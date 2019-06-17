import { transpile } from "../../src/transpiler";
import { IAggregate, IOperation } from "../../src/outline";
import { createJsonSchema } from "../../src/jsonSchema/createJsonSchema";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("We can create an Entity", () => {
  const source = `

@ api: person
type Person =
    Id: Identifier
    FirstName: String
    Addresses: List Address
    @ The Gender of a Person, this can be either Male, Female of Other
    Gender: Gender

@ This is an alias for String, DDD defines that you
@ will write every Value Object (in this case a property)
@ into it's own type.
alias AddressStreet = String

type Address =
    Street: AddressStreet

choice Gender =
    | "Male"
    | "Female"
    | "Other"

type KvK = 
    Number: String
    MembershipDate: Date

alias CustomerNumber = String

data Identifier =
    | KvK
    | CustomerNumber

`;

  const { ast, cst, tokens, errors } = transpile(source);
  const schema = createJsonSchema(ast);

  log(schema);

  //log(ast);
  if (errors && errors.length > 0) log(errors);

  it("Should not contain errors", () => {
    expect(errors.length).toEqual(0);
  });
});
