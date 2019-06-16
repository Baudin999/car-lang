# Domiain Driven Design

Domain Driven Design (DDD) is the practice of getting to the heart of software. We as an industry
always fight against complexity. On the one hand business wants more functionality to increase
business and on the other hand we find new technologies and applications which we want to experiment
with.

# AGGREGATES

Aggregate is a pattern in Domain-Driven Design. A DDD aggregate is a cluster of domain objects that
can be treated as a single unit. An example may be an order and its line-items, these will be
separate objects, but it's useful to treat the order (together with its line items) as a single
aggregate.

An aggregate will have one of its component objects be the aggregate root. Any references from
outside the aggregate should only go to the aggregate root. The root can thus ensure the integrity
of the aggregate as a whole.

Aggregates are the basic element of transfer of data storage - you request to load or save whole
aggregates. Transactions should not cross aggregate boundaries.

DDD Aggregates are sometimes confused with collection classes (lists, maps, etc). DDD aggregates are
domain concepts (order, clinic visit, playlist), while collections are generic. An aggregate will
often contain mutliple collections, together with simple fields. The term "aggregate" is a common
one, and is used in various different contexts (e.g. UML), in which case it does not refer to the
same concept as a DDD aggregate.

Martin Fowler https://www.martinfowler.com/bliki/DDD_Aggregate.html

In the car language an Aggregate is denoted as:

```
aggregate <Root> {
    <Value Object 1>
    <Value Object 2>
    <Value Object 3>
}
```

as an example imagine a Customer aggregate:

```
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
```

This definition indicates that the Customer aggregate only has the Address as a Value Object. When
you ask for Customer you will not automatically get the Contracts in your result.

## Operations

An aggregate should also be able to define its operations. This is done by defining methods on the
aggregate. As an example; we'll define CRUD operations on a Person aggregate:

```
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
```
