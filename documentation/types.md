# Types

In the `car` language types are defined like this:

```car
type Person =
    FirstName: String
    LastName: String
```

As you can see we can extract the following rules:

1.  Types always start with a capital letter.
2.  A `type` can be seen as a record type in Haskell
3.  The type a key has is always placed after the `:` colon.
4.  Fields begin with an indent of 4 spaces.
5.  Fields have a name "id" and a type.

There are

- String
- Char
- Number
- Boolean
- Date
- Time
- DateTime

We do not have types like `Float` or `Double` because these are types which are all in the type
`Number`. In the `car` language we do not represent the systems of record. If you would like to
express that something is for example a number with decimals you can create your own types by
defining an `alias`.

```
alias Money = Number
    | decimals 2
```

This will indicate that the `Money` type can now be used and will have validation on it specifying
that we would need at least and no more than 2 decimal numbers.

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

The last type is a type we'll have to discuss in details. It's the `data` type. The `data` type is
also called an [Algebraic Data Type](https://wiki.haskell.org/Algebraic_data_type) or a Sum Type.
The link provided goes to the Haskell description of what ADTs are. Haskell has been the main
influence when it came to the `data` type in the `car` language and because of this I've also called
it `data`. It is an option type. Your type is defined in terms of other types.

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
    | Nill
```

Because the `car` language does not do any form of implementation yet we can reduce the `List` type
to a much simpler:

```
type List a
```
