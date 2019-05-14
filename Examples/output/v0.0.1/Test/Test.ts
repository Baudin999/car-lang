
/*
GENERATED ON: 1557864792241
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



interface IList {

}
  


/**
Een item is iets wat we kunnen gebruiken
 */
interface IItem {
    Key: string;
    Value: string;
}
  



interface IPerson {
    Name: string;
    Something: IItem;
    Items: IItem[];
}
  
    