export declare const transpile: (source: string) => {
    tokens: import("chevrotain").IToken[];
    cst: any;
    ast: import("./outline").IExpression[];
    errors: import("./substitute").IError[];
};
