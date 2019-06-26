import { fakeModule } from "./../fakes";
import { IType, ITypeField } from "../../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("When you forget the equals (=) sign", () => {
  const source = `

type Person
    FirstName: String

`;

  it("CST should be defined", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    // log(tokens);
    // log(ast);
    //expect(errors.length).toEqual(1);
  });
});
