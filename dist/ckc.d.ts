import { IExpression, IError } from "./outline";
export declare const maybeRaiseError: (error: any) => void;
export interface IModule {
    name: string;
    ast: IExpression[];
    hash: string;
    errors: IError[];
    timestamp: Date;
}
export interface IModuleDictionary {
    [module: string]: IModule;
}
export declare const styleCSS = "\n/* RESET */\n\n*, *:before, *:after {\n    box-sizing: border-box;\n}\n\nhtml, body {\n  font-family: 'Roboto', 'Verdana', sans-serif;\n  margin: 0;\n  padding: 0;\n}\n\n\ntable, table tr, table tr td, tr table th {\n    border: none;\n    border-width: 0px;\n    border-image-width: 0px;\n    padding: 0;\n    margin: 0;\n    outline: none;\n    border-collapse: collapse;\n}\n\n/* TABEL STYLES */\ntable {\n    width: 100%;\n    border: 1px solid lightgray;\n    margin-bottom: 1rem;\n}\n\ntable tr:nth-child(even){background-color: #f2f2f2;}\n\ntable tr:hover {background-color: #ddd;}\n\ntable th {\n    text-align: left;\n    background-color: maroon;\n    color: white;\n}\n";
