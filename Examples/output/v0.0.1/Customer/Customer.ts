
/*
GENERATED ON: 1560927685721
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


interface ICreditCard {
    Number: string;
    ExpirationDate: Date;
}
  
type Id = string;
enum Gender {
    Male = "Male",
    Female = "Female",
    Other = "Other"
}

/**
The address of a person. This is the functional location of where a person
 lives. This type is of course designed for the Dutch address system.
 */
interface IAddress {
    Street: string;
    PostalCode: string;
    HouseNumber: number;
    HouseNumberExtension: string;
    City: string;
    CountryCode: string;
    Country: Maybe<string>;
}
  


interface IPerson {
    FirstName: Maybe<string>;
    LastName: string;
    Address: IAddress;
    Gender: Gender;
    CustomerId: Id;
    VATNumber: string;
}
  


interface IPaymentMethod {
    Customer: ICustomer;
    CreditCard: ICreditCard;
}
  


interface ICompany {
    OrganisationName: string;
    CustomerId: Id;
    VATNumber: string;
}
  

/**
Someone or some company who buys things
 */
interface ICustomer {
    CustomerId: Id;
    VATNumber: string;
}
  
    