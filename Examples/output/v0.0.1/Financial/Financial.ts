
/*
GENERATED ON: 1560603016489
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


interface ICurrency {
    Sign: string;
    Value: number;
}
  


interface ICreditCard {
    Number: string;
    ExpirationDate: Date;
}
  

/**
Pay from a debit account
 */
interface IDirectDebit {
    BankAccountNumber: string;
}
  
type IPaymentMethod = CreditCard | DirectDebit;
    