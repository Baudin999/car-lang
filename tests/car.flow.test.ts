import { DomainLexer } from "../src/lexer";
import { parser } from "../src/parser";
import { OutlineVisitor, IFlow } from "../src/outline";
import { transpile } from "../src/transpiler";

/*

FLOWS
---

A Flow describes how data will flow from one system to the next. A
flow is described the same way function types are defined in Haskell,
Elm, PureScript or other pure functional languages.

getBook :: BookName -> Book

Contrary to the languages like Haskell, car-lang does not implement 
real code. This means that we need to be more creative and more 
descriptive in our way of writing our flows. We can add parameter names
to the flow definitions in a style comparable to TypeScript:

getBook :: (name: BookName) -> (print: PrintVersion) -> Book

Car-lang will transpile these flows into PlantUML sequence diagrams.

*/

const log = source => {
    console.log(JSON.stringify(source, null, 4));
};

describe("Should be able to define an aggregate", () => {
    const source = `

flow {
    % title: Book Operations

    @ from: Entity Service
    @ to: SAP
    getBook :: BookName -> (name: String) -> Other -> Book

    findBooks :: String -> List Books
}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(parser.errors);
    //log(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});

/*

It is hard to do all of those annotations for the from and the to if 
the only thing you want to show is data flowing between things. This is 
why we also have the following notation:

("Entity Service", SAP) :: String -> String

*/

describe("Should be able to define an aggregate", () => {
    const source = `

flow {

    @ Name: Get Customer By Id
    @ Get a Customer by the customer_id which we have.
    @ Domain: Customer
    @ version: v01
    ("Entity Service", SAP) :: (customerId: String) -> Customer

}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(parser.errors);
    //log(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});

/*

We have four types of flows:

1) Normal functions
2) Request/Reply
3) Pub/Sub
4) Fire and Forget

(Simple maps, directed graphs) as created with the "map" keyword.

We will now describe how we will build these types of flows in our system:


*/

describe("Define three types of operations", () => {
    const source = `

flow {

    @ This is a simpel function
    getCustomer :: String -> Customer

    @ This is the Request reply 
    ("Entity Service", SAP) :: (customerId: String) -> (customer: Customer)

    @ this is Pub/Sub
    CustomerService sub "Customer Requested" :: String
    "Customer Service" pub CustomerReceived :: Customer

    @ this is Fire and Forget
    @ name: updateCustomer
    ("Entity Service", SAP)* :: Customer

}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(errors);
    //log((ast[0] as any).operations[0]);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});

/*

## Functions

In Haskell we can define a function by specifying its types:

```hs
getCustomer :: String -> Customer
```
This signature means that the funciton `getCustomer` takes a String
as the first parameter and returns a Customer object. The last parameter 
is always the return type. 



*/

describe("We should be able to define a function", () => {
    const source = `

flow {

    getCustomer :: (customerId: String) -> Customer

    @ logCustomer logs the Customer to the logging 
    @ files and returns the actual Customer. This
    @ function can be used to chain in a logger 
    @ without messing with composibility.
    logCustomer :: Customer -> Customer

}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(errors);
    //log(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});

/*

## Request Reply

Request/Reply is a really transient messaging pattern. You pass in a few 
parameters and get a result back. Only s single result is possible in the
car-lang. This is because returning mutiple parameters is a really, really
bad idea when it comes to composibility.

The difference between a Request/Reply pattern and a normal function is 
that a Request Reply definition has both a `from` and a `to` defined.

```
@ from: Integration
@ to: SAP
getCustomer :: (customerId: String) -> Customer
```

*/

describe("We should be able to define a function", () => {
    const source = `

flow {

    @ from: Integration
    @ to: SAP
    getCustomer :: (customerId: String) -> Customer

    (Gateway, Integration) :: (customerId: String) -> Customer

}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(errors);
    //log(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});

/*

## Pub / Sub

In software architecture, publish–subscribe is a messaging pattern where 
senders of messages, called publishers, do not program the messages to be 
sent directly to specific receivers, called subscribers, but instead 
categorize published messages into classes without knowledge of which 
subscribers, if any, there may be. Similarly, subscribers express interest 
in one or more classes and only receive messages that are of interest, 
without knowledge of which publishers, if any, there are. 

In true pub/sub publishing events should be completely unrelated to the
subscription to events. We will try and formalize these patterns in the 
car-language so that we can safely write our documentation for these 
patterns.

*/

describe("We should be able to define Pub/Sub operations", () => {
    const source = `

flow {

    CustomerService sub "Find Customer" :: (customerId: String) -> (b: Boolean)

}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(errors);
    //log(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });
});

/*

## Fire and Forget

Let's look at fire and forget. Fire and forget is a way to send a message
to a system, component or something else without getting a reply.

This is not entirely true, you might get a technical reply, something like
"Message Received" or "Accepted" or something like that. I personally think
that you should always get a message. This way you know you've, at a minimum,
given a message which is structurally sound and passes the validation 
requirements.

Imagine the following scenario where we will send a Customer Service a 
message, indicating that the customer wants another product. This message 
should trigger a workflow to add the product to the list of products the 
Customer already has. 
Now, also imagine that we want to do this as a "Fire and Forget" scenario...

The parameters we will be giving this service call are:

```
Customer -> NewProduct -> Proposition
```

*/

describe("We should be able to define Fire & Forget operations", () => {
    const source = `

flow {

    (Integration, "Customer Service")* :: Customer -> (newProduct: Product) -> Proposition

}

`;

    const { cst, errors, ast, tokens } = transpile(source);

    //log(errors);
    //log(ast);

    it("CST should be defined", () => {
        expect(cst).toBeDefined();
    });

    it("Should have three parameters", () => {
        // the ast contains a flow and that flow has an operation with three params
        let operation = (ast[0] as any).operations[0];
        expect(operation.params.length).toEqual(3);
        expect(operation.params[0].id).toEqual("Customer");
        expect(operation.params[0].ofType).toEqual("Customer");
        expect(operation.params[1].id).toEqual("newProduct");
        expect(operation.params[1].ofType).toEqual("Product");
        expect(operation.params[2].id).toEqual("Proposition");
        expect(operation.params[2].ofType).toEqual("Proposition");
    });
});
