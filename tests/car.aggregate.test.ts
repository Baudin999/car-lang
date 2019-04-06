import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor } from "./../src/outline";
import { transpile } from "../src/transpiler";
import { createERD } from "../src/erd/createERD";
import { typeChecker } from "../src/tchecker";

/*
AGGREGATES

Aggregate is a pattern in Domain-Driven Design. A DDD aggregate is 
a cluster of domain objects that can be treated as a single unit. 
An example may be an order and its line-items, these will be 
separate objects, but it's useful to treat the order (together with 
its line items) as a single aggregate.

An aggregate will have one of its component objects be the aggregate 
root. Any references from outside the aggregate should only go to 
the aggregate root. The root can thus ensure the integrity of the 
aggregate as a whole.

Aggregates are the basic element of transfer of data storage - you 
request to load or save whole aggregates. Transactions should not 
cross aggregate boundaries.

DDD Aggregates are sometimes confused with collection classes
(lists, maps, etc). DDD aggregates are domain concepts (order, 
clinic visit, playlist), while collections are generic. An 
aggregate will often contain mutliple collections, together with 
simple fields. The term "aggregate" is a common one, and is used 
in various different contexts (e.g. UML), in which case it does 
not refer to the same concept as a DDD aggregate.

Martin Fowler
https://www.martinfowler.com/bliki/DDD_Aggregate.html

In the car language an Aggregate is denoted as:

aggregate <Root> {
    <Value Object 1>
    <Value Object 2>
    <Value Object 3>
}

as an example imagine a Customer aggregate:

aggregate Customer {
    Address
}

type Customer =
    Name: String
    Addresses: List Address
    Contracts: List Contract

type Address =
    Street: String
    HouseNumber: Number
    HouseNumberExtension: String

type Contract =
    Number: Number

This definition indicates that the Customer aggregate only has the 
Address as a Value Object. When you ask for Customer you will not 
automatically get the Contracts in your result.

*/

const log = source => {
    console.log(JSON.stringify(source, null, 4));
};

describe("Should be able to define an aggregate", () => {
    const source = `

aggregate Person {
    % title: Person Aggregate
    % version: 1

    Address
    Foo
}

type Person 

type Address 

type Foo =
    Bar: String

`;

    const tokenStream = DomainLexer.tokenize(source);
    parser.input = tokenStream.tokens;
    const cst = parser.START();
    const visitor = new OutlineVisitor();
    const ast = visitor.visit(cst);
    const errors = typeChecker(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});

describe("The Aggregate root should be a known type", () => {
    const source = `

aggregate Person {
    % title: Person Aggregate
    % version: 1

    Address
}

type Address 

`;

    const tokenStream = DomainLexer.tokenize(source);
    parser.input = tokenStream.tokens;
    const cst = parser.START();
    const visitor = new OutlineVisitor();
    const ast = visitor.visit(cst);
    const errors = typeChecker(ast);

    it("Errors should be of length 1", () => {
        expect(errors.length).toEqual(1);
    });
});

describe("The Aggregate contains an unknown Value Object known type", () => {
    const source = `

aggregate Person {
    % title: Person Aggregate
    % version: 1

    Address
}

type Person

`;

    const tokenStream = DomainLexer.tokenize(source);
    parser.input = tokenStream.tokens;
    const cst = parser.START();
    const visitor = new OutlineVisitor();
    const ast = visitor.visit(cst);
    const errors = typeChecker(ast);

    it("Errors should be of length 1", () => {
        expect(errors.length).toEqual(1);
    });
});
