# New Features

This document will describe the new features which are planned for the `car` language.

## Assignment

We should be able to assign something:

```
let a = 2

type Person =
    FirstName: Maybe String
    LastName: String

let peterPan =
    { FirstName: Just "Peter"
    , LastName: "Pan"
    }


```

## Operations and Operators

An operation is something which you can do on a type, for example the operation addition takes two
values of type `Number` and adds them together, returning a `Number`.

```
add :: Number -> Number -> Number
```

The Addition operator would look something like:

```
(+) :: Number -> Number -> Number
```

Or if you'd just want to alias the operation `add` you'd go:

```
alias (+) = add
```

The problem with these operators is that it's hard to work around things like operator precedence
for binary operators. So, for example:

```
(+) :: Number -> Number -> Number
(-) :: Number -> Number -> Number

let foo = 2 - 3 + 4
```

This can result in either `(2 - 3) + 4 = 3` or `2 - (3 + 4) = -5`. I do not know how to solve this
yet but it is rather fundamental and should be done right!

## Splitting up the compiler

In order to do these kinds of things we might look into splitting up the compiler and work with
"compiler features". I do not know yet how to do this, but it seems like that would be a reasonable
thing to do.

I might experiment with splitting some things up.
