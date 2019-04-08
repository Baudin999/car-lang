# The `CAR` language

The `car` language in build with a specific purpose in mind. The `car` language is the basis for
writing "good software" with which I mean that the language should help you document your code and
provide views on your code for other audience members.

As such the `car` language implements visualization extensions which make it almost trivial to build
your own visualizations on top of the AST.

## Markdown

The `car` language integrates markdown within your code. You can write your code just like you would
normally do but you can add markdown to really document it! Use this as a way to describe what
happens.

## Quick language reference

Type define structures, records, in the language:

```
type Person =
    FirstName: Maybe String
    LastName: String
```

An alias can be used to "rename" a structure:

```
@ 12 or 14 long starting with an 8
alias EAN = String
    | min 12
    | max 14
    | pattern /^8[0-9]{11}([0-9]{2})?$/
```

A `choice` is used to enumerate things:

```
choice Color =
    | "Green"
    | "Red"
    | "Yellow"
    | "Purple"
```

The keyword `data` is used as a sum type, this is the difficult type and if you are unfamiliar with
Algebraic data types you should read up on them....they are awesome!

```
data Maybe a =
    | Just a
    | Nothing

data Either a b =
    | Left a
    | Right b

data List a =
    | List a
    | Nill

```

## Annotations

Annotations are part of a type and as such are part of the documentation. We
should think of annotations not as comments but as descriptions. There are two
types of annotations, the "description" kind:

```
@ This is a description in the form of an annotation
@ it can span multiple lines.
type Person
```

There is also a qualified annotation:

```
@ ignore: true
@ aggregate: Person
type person
```

There qualified annotations are used in the rest of the application to generate
certain patterns.

The following annotations are used:

| Type | Key | Values | Description |
---
| Flow.Operation | to | string | A string which describes a vertical lane in the Sequence Diagram |
| Flow.Operation | from | string | A string which describes a vertical lane in the Sequence Diagram from which the operation will return |
| type, alias, data | ignore | boolean | Indicating if we should ignore that type in the output of our diagrams |

## Functional Programming

The `car` language recognizes that functional programming is both hard and that functional
programming is the true future of programming. This is why I've taken a good hard look at the
current state of functional programming and tried to grab the best parts of the languages which I
admire. Here's a small list of potential features which will probably be in the `car` language:

-   Type Classes (like Haskell)
-   Simple Module System (like OCaml)
-   Simple Error messages (like Elm)

The first thing I'll implement is the [type system](./documentation/types.md).

## Domain Driven Design

A quick introduction on how to do DDD in the car-lang can be found [this](./documentation/ddd.md) page.

## Railroad Diagram

For those of you who really want to understand the language instead of looking at examples you can
look at the [Railroad](./railroad.html) diagram. This will give you everything you'll need to know.

## New Features

A naive description of potential new features can be found on the
[new page](./documentation/new.md).
