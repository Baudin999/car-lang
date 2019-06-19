
/*
GENERATED ON: 1560927685732
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


interface IResponse {
    Body: Ia;
}
  


interface ICustomer {
    Name: string;
    Number: string;
}
  


interface ICustomerResponse {
    Body: ICustomer;
}
  


interface IError {
    Code: string;
    Message: string;
}
  


interface INotFound {
    Code: string;
    Message: string;
}
  


interface IOtherError {
    Code: string;
    Message: string;
}
  
type IApiResponse = CustomerResponse | NotFound | OtherError;
    