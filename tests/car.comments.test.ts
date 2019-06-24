import { IType, NodeType, IAlias, IData, IView, IComment } from "../src/outline";
import { Module } from "../src/Module";
import { fakeConfig, fakeModule } from "./fakes";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

/**
 *
 * # COMMENTS
 * Comments are a big part in writing things. It is important
 * that comments can wrap types, because you never know when you'd
 * want to remove things without removing them.
 */
describe("Let us define a comment", () => {
  const source = `


{*
  We define APIs with a Request and a Response, this pattern
  I'll be describing in the following sections will not work
  for push notifications.

type Foo =
    Bar: String
*}


`;

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast.length).toBe(1);
    let comment = ast[0] as IComment;
    expect(comment).toBeDefined();
    expect(comment.type).toBe(NodeType.COMMENT);
    next();
  });
});

describe("Get an error when wrapping to dependent type in a comment", () => {
  const source = `


{*
  Rethink this type

type Foo =
    Bar: String
*}

type Person =
    Something: Foo


`;

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast.length).toBe(2);
    let comment = ast[0] as IComment;
    expect(comment).toBeDefined();
    expect(comment.type).toBe(NodeType.COMMENT);
    expect(errors.length).toBe(1);
    next();
  });
});

describe("We should be able to comment out a field from a type", () => {
  const source = `

# Rethink this type

type Foo =
    {* Bar: String *}
    Name: String


type Person =
    Something: Foo


`;

  it("We should be able to tokenize", async next => {
    let { cst, ast, errors } = await fakeModule(source);
    expect(ast.length).toBe(3);
    let foo = ast[1] as IType;
    expect(foo.fields.length).toEqual(1);
    let bar = foo.fields.find((f: any) => f.id === "Bar");
    expect(bar).toBeUndefined();
    next();
  });
});
