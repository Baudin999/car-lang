[read the docs](https://baudin999.github.io/car-lang/)

# ZDragon

ZDragon is the toolset around the `CAR` language. The `CAR language is a descriptive languages, not
a programming language, created with the specific purpose of writing architecture. While working as
an architect for many years I've always had the feeling that 'doing' architecture could be easier
than it was. Tools like Archimate and Enterprise Architect feel convoluted; especially when you come
from a developer background in which writing code was the easiest way to express intent.

## Architectural Intent

ZDragon focusses on Architectural Intent. This means that we focus on what you want to achieve
instead of how you'd like to achieve it. The intent is reflected in multiple ways, for example,
there is no way of ordering or changing the layout of your diagrams. This is intentional. At first
this might seem weird, but after a while you will find that it relieves a lot of ambiguaty. You just
write what you want and let the tool generate the output, forcing consistancy and reducing waste.

## Functional Programming

The `CAR` language recognizes that functional programming is both hard and that functional
programming is the true future of programming. This is why I've taken a good hard look at the
current state of functional programming and tried to grab the best parts of the languages which I
admire. Here's a small list of potential features which will probably be in the `CAR` language:

- Types (like Haskell)
- Simple Module System (like OCaml) every file is a module with automatic exports
- Simple Error messages (like Elm)

## Domain Driven Design

Domain Driven Design is at the root of the architectural decisions made in ZDragon. A quick
introduction on how to do DDD in the car-lang can be found [this](./documentation/ddd.md) page.

## Railroad Diagram

For those of you who really want to understand the language instead of looking at examples you can
look at the [Railroad](./railroad.html) diagram. This will give you everything you'll need to know.

## Read the Docs

If you'd like to know how to use the tools you can follow these links:

- [Getting Started](./documentation/getting_started.md)
- [The Compiler](./documentation/compiler.md)
- [Type System](./documentation/types.md)
- [DDD](./documentation/ddd.md)
- [XSD](./documentation/xsd.md)
- [What's coming](./documentation/new.md)
