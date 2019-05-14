
/*
GENERATED ON: 1557864792237
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
  

type Author = string;



interface IFileInfo {
    Size: number;
    LastModified: string;
    FullPath: string;
    CreatedBy: Author;
    ModifiedBy: Author;
}
  



interface IDirectoryInfo {
    Children: IFileSystemInfo[];
}
  
    