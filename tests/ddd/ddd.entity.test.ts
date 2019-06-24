import { IAggregate, IOperation } from "../../src/outline";
import { fakeModule } from "../fakes";

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

  it("Should result in valid elements", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });

  it("Should not contain errors", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(errors.length).toEqual(0);
  });

  it("Should have two operations and the operations should be correct", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    let aggreagte = ast[3] as IAggregate;
    expect(aggreagte.operations.length).toEqual(2);
    let operation1 = aggreagte.operations[0];
    expect(operation1.id).toEqual("getPerson");
    expect(operation1.params[0].id).toEqual("id");
    expect(operation1.params[0].ofType).toEqual("Number");
    expect(operation1.params[1].id).toEqual("Something");
    expect(operation1.params[1].ofType).toEqual("Something");
    expect(operation1.annotations.length).toEqual(1);

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

  it("Should result in valid elements", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(cst).toBeDefined();
    expect(ast).toBeDefined();
    expect(tokens).toBeDefined();
    expect(errors).toBeDefined();
  });

  it("Should not contain errors", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    expect(errors.length).toEqual(0);
  });

  it("Should have two operations and the operations should be correct", async () => {
    let { cst, ast, errors, tokens } = await fakeModule(source);
    let aggreagte = ast[2] as IAggregate;
    expect(aggreagte.operations.length).toEqual(4);
  });
});
