import * as fetch from "node-fetch";
import { IRestriction, IExpression, IError } from "./outline";
import { IToken } from "chevrotain";
import { readFile } from "fs";

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
   * The CST as outputted by the chevrotain parser.
   */
  cst: any[];

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

  /**
   * The ERD URL
   */
  erdURL?: string;

  fullPath: string;
  source: string;
  outPath: string;
  config: IConfiguration;

  parse: () => IModule;

  link: (modules: IModule[]) => Promise<IModule>;

  update: (source?: string) => Promise<IModule>;

  writeDocumentation: () => Promise<IModule>;
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

export const readFileAsync = (filePath, parse = false) => {
  return new Promise(function(resolve, reject) {
    readFile(filePath, "utf8", (err, source) => {
      if (err) reject(err);
      else {
        resolve(parse ? JSON.parse(source) : source);
      }
    });
  });
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
  n: number = 40,
  split: string = "\n",
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
    return foldText(s.substring(n), n, split, useSpaces, a);
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
    return foldText(s.substring(nextIdx), n, split, useSpaces, a);
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
    case "Char":
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

export const last = <T>(array: T[]): T => {
  return array[array.length - 1];
};

export const splitFrom = <T>(array: T[], index: number): { start: T[]; end: T[] } => {
  let start = array.slice(0, index);
  let end = array.slice(index, array.length - 1);
  return { start, end };
};

export const splitFromLast = <T>(array: T[]): { items: T[]; last: T } => {
  let { start } = splitFrom(array, array.length - 1);
  return { items: start, last: last(array) };
};

export const baseTypeToJSONType = (b: string): string | null => {
  switch (b) {
    case "String":
    case "Date":
    case "DateTime":
    case "Time":
      return "string";
    case "Number":
      return "number";
    case "Boolean":
      return "boolean";
    default:
      return null;
  }
};

export const baseTypeToTypeScriptType = (b: string): string | null => {
  switch (b) {
    case "String":
      return "string";
    case "Number":
      return "number";
    case "Boolean":
      return "boolean";
    case "Date":
      return "Date";
    case "DateTime":
      return "Date";
    case "Time":
      return "string";
    default:
      return "I" + b;
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
  outPath?: string;
}
