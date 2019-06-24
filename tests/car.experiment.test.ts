import { fakeModule } from "./fakes";
import { IData } from "../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Experiment with the language", () => {
  const source = `

type Person =
    @ This is the name
    FirstName: String

`;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast).toBeDefined();
  });
});
