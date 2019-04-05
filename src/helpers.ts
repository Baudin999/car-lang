import * as fetch from "node-fetch";
import { IRestriction, IExpression, IError } from "./outline";
import { IToken } from "chevrotain";

/**
 *
 * "startLine": 2,
 * "endLine": 2,
 * "startColumn": 14,
 * "endColumn": 19,
 *
 */
export const getStartToken = (tokenId: any): ITokenStart => {
    const result = {
        startLineNumber: tokenId.startLine || tokenId.startLineNumber,
        endLineNumber: tokenId.endLine || tokenId.endLineNumber,
        startColumn: tokenId.startColumn,
        endColumn: tokenId.endColumn + 1
    };
    return result;
};
export interface ITokenStart {
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
}

export interface IModule {
    /**
     * The Name pf the module something like:
     * Prelude
     * Services.Customer
     */
    name: string;

    /**
     * The path on the file system where we can find the actual file.
     */
    path: string;

    /**
     * The hash of the source, this is used so that we can skip the
     * compilation if the hash is not different.
     */
    hash: string;

    /**
     * The actual AST the source code transpiles to.
     */
    ast: IExpression[];

    /**
     * The actual AST the source code transpiles to.
     */
    tokens: IToken[];

    /**
     * Transpilation and type checking errors
     */
    errors: IError[];

    /**
     * Last compile run date/time.
     */
    timestamp: Date;

    erdURL?: string;
}

export interface IModuleDictionary {
    [module: string]: IModule;
}

export const flatten = <T>(items: T[]): T[] => {
    return [].concat.apply([], items);
};

export const purge = <T>(items: T[]): T[] => {
    return flatten(items).filter(i => !!i);
};

export const clone = (source: any, template?: any) => {
    if (template) {
        return { ...JSON.parse(JSON.stringify(source)), ...template };
    } else {
        return JSON.parse(JSON.stringify(source));
    }
};

/**
 * Fold a long line and intersperse with newlines at certain intervals
 * @param s - input string
 * @param n - number of chars at which to separate lines
 * @param useSpaces - if true, attempt to insert newlines at whitespace
 * @param a - array used to build result, defaults to new array
 */
export function foldText(
    s: string,
    split: string = "\n",
    n: number = 40,
    useSpaces: boolean = true,
    a: string[] = []
): string {
    a = a || [];
    if (s.length <= n) {
        a.push(s);
        return a.join(split);
    }
    var line = s.substring(0, n);
    if (!useSpaces) {
        // insert newlines anywhere
        a.push(line);
        return foldText(s.substring(n), split, n, useSpaces, a);
    } else {
        // attempt to insert newlines after whitespace
        var lastSpaceRgx = /\s(?!.*\s)/;
        var idx = line.search(lastSpaceRgx);
        var nextIdx = n;
        if (idx > 0) {
            line = line.substring(0, idx);
            nextIdx = idx;
        }
        a.push(line);
        return foldText(s.substring(nextIdx), split, n, useSpaces, a);
    }
}

export const fetchImage = url => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(r => r.text())
            .then(r => {
                resolve(r);
            });
    });
};

export const baseTypes = [
    "String",
    "Char",
    "Integer",
    "Number",
    "Decimal",
    "Double",
    "Boolean",
    "Date",
    "Time",
    "DateTime"
];

export const baseTypeToXSDType = (b: string) => {
    switch (b) {
        case "String":
            return "xsd:string";
        case "Number":
            return "xsd:integer";
        case "Boolean":
            return "xsd:boolean";
        case "Date":
            return "xsd:date";
        case "DateTime":
            return "xsd:dateTime";
        case "Time":
            return "xsd:time";
        default:
            return `self:${b}`;
    }
};

export const mapRestrictionToXSD = (baseType: string, restriction: IRestriction) => {
    switch (baseType) {
        case "String":
            switch (restriction.key) {
                case "min":
                    return `<xsd:minLength value="${restriction.value}" />`;
                case "max":
                    return `<xsd:maxLength value="${restriction.value}" />`;
                case "length":
                    return `<xsd:length value="${restriction.value}" />`;
                case "pattern":
                    return `<xsd:pattern value="${restriction.value}" />`;
                default:
                    return "";
            }
        case "Char":
            return `
      <xsd:minLength value="1" />
      <xsd:maxLength value="1" />
      `.trim();
        case "Number":
            switch (restriction.key) {
                case "min":
                    return `<xsd:minInclusive value="${restriction.value}" />`;
                case "max":
                    return `<xsd:maxInclusive value="${restriction.value}" />`;
                case "pattern":
                    return `<xsd:pattern value="${restriction.value}" />`;
                default:
                    return "";
            }
        default:
            return "";
    }
};

export interface IConfiguration {
    name: string;
    version: string;
    xsd: {
        namespace: string;
    };
    json: {
        namespace: string;
    };
}
