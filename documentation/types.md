# Types

In the `car` language types are defined like this:

```car
type Person =
    FirstName: String
    LastName: String
```

<iframe width="560" height="315" src="https://www.youtube.com/embed/WrRYmbP6WM8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

As you can see we can extract the following rules:

1.  Types always start with a capital letter.
2.  A `type` can be seen as a record type in Haskell
3.  Fields begin with an indent of 4 spaces or a tab.
4.  Fields have a name, an "id" and a type.
5.  The setarator between the id and the type is a :

There are "base types" as we like to call them in programming. You do not have to define the base
types in order to use them in your documentation. These base types are:

- String
- Char
- Number
- Boolean
- Date
- Time
- DateTime

We do not have types like `Float` or `Double` because these are types which are all in the type
`Number`. In the `car` language we do not represent the systems of record.

If you would like to express that something is for example a number with decimals you can create
your own types by defining an `alias` like so:

```
alias Money = Number
    | decimals 2
```

This will indicate that the `Money` type can now be used and will have validation on it specifying
that we would need at least and no more than 2 decimal numbers.

<iframe width="560" height="315" src="https://www.youtube.com/embed/iMmXbOM-Ues" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Every language which can create a description of data should also be able to represent some sort of
selection list, an enumeration of sorts. In the `car` language this is called a `choice`. Defining a
`choice` is really straight forward. A `choice` can either be string literals or number literal.

```
choice HealtyFood =
    | "Carrots"
    | "Eggs"
    | "Yoghurt"

choice CookingTimeInMinutes =
    | 5
    | 7.5
    | 10
    | 20

```

The last type in the `car` language is a type we'll have to discuss in detail. It's the `data` type.
The `data` type is also called an
[Algebraic Data Type](https://wiki.haskell.org/Algebraic_data_type) or a Sum Type. The link provided
goes to the Haskell description of what ADTs are. Haskell has been the main influence when it came
to the `data` type in the `car` language and because of this I've also called it `data`. It is an
option type. Your type is defined in terms of other types.

<iframe width="560" height="315" src="https://www.youtube.com/embed/kQc2ejk9YWE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

> Sorry: Something went wrong with the video, will upload a new one about data types and choices

A lot of times in software we'll need a recursive data type, in our case we would use the `data`
keyword. Imagine having to model the filesystem:

```

open Prelude importing (List)


alias Author = String
    | pattern /[A-Z][a-z]* [[A-Z][a-z]*]/

type FileInfo =
    Size: Number
    LastModified: String
    FullPath: String
    CreatedBy: Author
    ModifiedBy: Author

type DirectoryInfo =
    Children: List FileSystemInfo

data FileSystemInfo =
    | FileInfo
    | DirectoryInfo

```

As you might notice from this model we have a recursive structure around the file system.
FileSystemInfo type can be either of type `FileInfo` or of type `DirectoryInfo`, both of which are
defined as types.

This was an example where the types in the `data` type were concrete types, meaning that they were
already defined in the rest of the document. You can also have non-concrete types. They will create
a constructor function for each of the types.

This brings me to the two already defined data types in the `car` languages. They are from the
`Prelude` module, these types are called: `Maybe` and `List`. Both are generic types and are defined
like so:

```
data Maybe a =
    | Just a
    | Nothing


data List a =
    | List a
    | Nil

type Branch a =
    Left: a
    Value: a
    Right: a

data Tree a =
    | Nil
    | Branch a

```

Because the `car` language does not do any form of implementation yet we can reduce the `List` type
to the much simpler:

```
type List a
```

### Rcursive Types

Because of the power which ADTs bring to the type system we can start defining recursive data types
like a file system type:

```
alias Author = String
    | pattern /[A-Z][a-z]* [[A-Z][a-z]*]/

type FileInfo =
    Name: String
    Size: Number
    LastModified: String
    FullPath: String
    CreatedBy: Author
    ModifiedBy: Author

type DirectoryInfo =
    Name: String
    Children: List FileSystemInfo
    CreatedBy: Author

data FileSystemInfo =
    | FileInfo
    | DirectoryInfo
```

Here you can see that the `FileSystemInfo` type can be either of type `FileInfo` or of type
`DirectoryInfo` and a `DirectoryInfo` type can consist of a list of `FileSystemInfo` elements. This
is called recursion. In this specific case we are modeling a Tree structure.

## Extending Types

Types can inherit fields from each other. We could write something like:

```
type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person extends Human =
    CallingName: String
```

This will result in two types; of which the type `Person` has 5 fields, all of the fields from the
type `Human` and the field `CallingName`.

You can always extend a type with non existing types, but you will get an error.

```
type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person extends Human, Ironman, Hulk =
    CallingName: String
```

The errors would be:

```
[
    {
        "message": "Could not find type Ironman to extend from",
        "startLineNumber": 9,
        "endLineNumber": 9,
        "startColumn": 27,
        "endColumn": 34
    },
    {
        "message": "Could not find type Hulk to extend from",
        "startLineNumber": 9,
        "endLineNumber": 9,
        "startColumn": 35,
        "endColumn": 39
    }
]
```

I've taken the time to provide meaningful error messages, but the posibilities for errors are so
great that the error messaging is not exhaustive. Please keep in mind that the compiler is very,
very lenient. This means that it will always produce output even if there are errors.

## Plucking fields

To pluck a field is to reuse a Value Object from an entity. If we had only wanted to reuse the
`FirstName` field for some reason we could use the `pluck` syntax.

```
type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person =
    pluck Human.FirstName
    CallingName: String
```

Sometimes, and I really mean _sometimes_ we would like to rename the field to something else. This
can be achieved by using the `dot` notation on the field type itself to **pluck** the field type
from the type we're using.

```
type Human =
    FirstName: Maybe String
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person =
    StartName: Human.FirstName
    CallingName: String
```

Use this sparingly because renaming fields but keeping the type intact can be really, really
dangerous.

Preserving annotations and other things we apply to the plucked fields is really important. This
keeps the documentation in line and allows you to evolve your data models into more advanced sets of
descriptions. You can of course annotate everything and keep it preserved:

```
type Human =
    FirstName: Maybe String
        | min 10
        | max 90
    LastName: String
    MiddleNames: List String
    DateOfBirth: Date

type Person =
    @ This is an annotation for the FuurstName
    @ The FuurstName comes from the "Human" type
    FuurstName: Human.FirstName
        | min 12
        | other "foo"
    CallingName: String
```
