import { createJsonSchema } from "../../src/transformations/jsonSchema/createJsonSchema";
import { createXSD } from "../../src/transformations/xsd/createXSD";
import { fakeModule } from "../fakes";

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

  it("Should not contain errors", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    const schema = createJsonSchema(ast);
    const xsd = createXSD(ast);
    expect(errors.length).toEqual(0);
  });
});
