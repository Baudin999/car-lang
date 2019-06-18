
/*
GENERATED ON: 1560834631595
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


interface IKlas {
    Studenten: IStudent[];
    Docenten: IDocent[];
}
  


interface IStudent {
    Nummer: string;
    HeeftVakken: IVak[];
    Voornaam: string;
    Achternaam: string;
    ActiefAdres: IAdres;
}
  


interface IDocent {
    DocentenNummer: string;
    BevoegdVoor: IVak[];
    Voornaam: string;
    Achternaam: string;
    ActiefAdres: IAdres;
}
  


interface IPersoon {
    Voornaam: string;
    Achternaam: string;
    ActiefAdres: IAdres;
}
  


interface IAdres {
    Straat: string;
    Huisnummer: string;
}
  


interface IVak {
    Naam: string;
    IsBelangrijk: boolean;
}
  
    