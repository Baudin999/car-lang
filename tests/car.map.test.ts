import { fakeModule } from "./fakes";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

/**
 * MAPs are simple flows which you can use to design
 * simple mind-maps and data flows.
 */
describe("Define and parser a simple type", () => {
  const source = `

map {
    Foo -> Bar -> "Or other thing I'd like to see" -> Something

    Something -> Foo

    Foo -> Other
}

`;
  it("We should be able to tokenize", async () => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast).toBeDefined();
  });
});
