import { fakeModule } from "./fakes";
import { IComment, NodeType, IData } from "../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("Experiment with the language", () => {
  const source = `


data Maybe a =
    | Just a
    | Nothing


data List a =
    | List a
    | Nil

data Tree a =
    | Nil
    | Branch a


`;

  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast.length).toBe(3);
    let data = ast[0] as IData;
    expect(data).toBeDefined();
    expect(data.options.length).toEqual(2);
  });
});
