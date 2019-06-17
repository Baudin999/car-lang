import { createXSD } from "../../src/xsd/createXSD";
import { transpile } from "../../src/transpiler";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("A Type can be converted into an XSD", () => {
  const source = `
  
type Person =
    Names: List String

type Calls =
    Customers: List Person
  `;

  const { ast, cst, tokens, errors } = transpile(source);
  const xsd = createXSD(ast, {
    version: "1.0",
    xsd: {
      namespace: "http://xsd.essent.nl"
    }
  } as any);

  if (errors && errors.length > 0) log(errors);

  it("Should not contain errors", () => {
    expect(errors.length).toEqual(0);
  });
});
