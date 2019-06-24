import { fakeModule } from "../fakes";
import { createXSD } from "../../src/transformations/xsd/createXSD";

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

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    const xsd = createXSD(ast, {
      version: "1.0",
      xsd: {
        namespace: "http://xsd.essent.nl"
      }
    } as any);
    expect(ast).toBeDefined();
    expect(errors.length).toEqual(0);
  });
});
