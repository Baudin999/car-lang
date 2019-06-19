
/*
GENERATED ON: 1560927685722
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


interface IPerson {
    Name: string;
    Address: IAddress;
}
  


interface IAddress {

}
  


interface IFood {

}
  
    