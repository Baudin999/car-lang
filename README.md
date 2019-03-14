# The `CAR` language

The `car` language in build with a specific purpose in mind. The `car` language is the basis for
writing "good software" with which I mean that the language should help you document your code and
provide views on your code for other audience members.

As such the `car` language implements visualization extensions which make it almost trivial to build
your own visualizations on top of the AST.

## Markdown

The `car` language integrates markdown within your code. You can write your code just like you would
normally do but you can add markdown to really document your code.

## Functional Programming

The `car` language recognizes that functional programming is both hard and the true future of
programming. This is why I've taken a good hard look at the current state of functional programming
and tried to grab the best parts of the languages which I could find. Here's a small list of
potential features which will probably be in the `car` language:

- Type Classes (like Haskell)
- Simple Module System (like OCaml)
- Simple Error messages (like Elm)

The first thing I'll implement is the [type system](./documentation/types.md).

## Railroad Diagram

[Railroad](./railroad.html)
