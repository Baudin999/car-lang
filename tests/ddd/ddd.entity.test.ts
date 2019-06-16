import { transpile } from "../../src/transpiler";
import { IAggregate, IOperation } from "../../src/outline";

const log = source => {
  console.log(JSON.stringify(source, null, 4));
};

describe("We can create an Entity", () => {
  const source = `

type Person =
    Address: Address

type Address

type Food

aggregate Person {
    Address
    Food

    @ getPerson returns the Person Aggregate
    getPerson :: (id: Number) -> Something -> Self
    
    setAddress :: Address -> Self
}

`;

  const { ast, cst, tokens, errors } = transpile(source);

  //log(ast);
  if (errors && errors.length > 0) log(errors);

  it("Should result in valid elements", () => {
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });

  it("Should not contain errors", () => {
    expect(errors.length).toEqual(0);
  });

  it("Should have two operations and the operations should be correct", () => {
    let aggreagte = ast[3] as IAggregate;
    expect(aggreagte.operations.length).toEqual(2);
    let operation1 = aggreagte.operations[0];
    expect(operation1.id).toEqual("getPerson");
    expect(operation1.params[0].id).toEqual("id");
    expect(operation1.params[0].ofType).toEqual("Number");
    expect(operation1.params[1].id).toEqual("Something");
    expect(operation1.params[1].ofType).toEqual("Something");

    let operation2 = aggreagte.operations[1];
    expect(operation2.id).toEqual("setAddress");
  });
});

describe("We can create an Entity", () => {
  const source = `

type Person =
    Name: String
    Address: Address

type Address

aggregate Person {
    Address

    getPerson :: (id: String) -> PersonAggregate
    updatePerson :: PersonAggregate -> PersonAggregate
    updatePersonAddress :: Address -> PersonAggregate
    deletePersonAggregate :: (id: String) -> Boolean
}

`;

  const { ast, cst, tokens, errors } = transpile(source);

  //log(ast);
  if (errors && errors.length > 0) log(errors);

  it("Should result in valid elements", () => {
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });

  it("Should not contain errors", () => {
    expect(errors.length).toEqual(0);
  });

  it("Should have two operations and the operations should be correct", () => {
    let aggreagte = ast[3] as IAggregate;
    expect(aggreagte.operations.length).toEqual(4);
  });
});
