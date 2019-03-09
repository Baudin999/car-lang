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
