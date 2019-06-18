
/*
GENERATED ON: 1560833885121
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
  
type IFileSystemInfo = FileInfo | DirectoryInfo;
    