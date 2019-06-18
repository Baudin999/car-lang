
/*
GENERATED ON: 1560833466447
*/ 


// The Maybe Monad implemented in TypeScript
type Maybe<T> = Nothing<T> | Just<T>

class Just<T> {
  a: T;
  constructor(a) {
    if (a !== null && a !== undefined) this.a = a;
    // @ts-ignore
    else return new Nothing();
  }
}

class Nothing<T> {}

// IMPLEMENTATION


interface IHuman {
    FirstName: Maybe<string>;
    LastName: string;
    MiddleNames: string[];
    DateOfBirth: Date;
}
  


interface IPerson {
    FuurstName: Maybe<string>;
    LastName: string;
    CallingName: string;
}
  
    