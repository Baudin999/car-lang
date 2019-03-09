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

export const flatten = <T>(items: T[]): T[] => {
  return [].concat.apply([], items);
};

export const purge = <T>(items: T[]): T[] => {
  return flatten(items).filter(i => !!i);
};

export const clone = source => {
  return JSON.parse(JSON.stringify(source));
};

/**
 * Fold a long line and intersperse with newlines at certain intervals
 * @param s - input string
 * @param n - number of chars at which to separate lines
 * @param useSpaces - if true, attempt to insert newlines at whitespace
 * @param a - array used to build result, defaults to new array
 */
export function foldText(s: string, n: number = 40, useSpaces: boolean = true, a: any[] = []) {
  a = a || [];
  if (s.length <= n) {
    a.push(s);
    return a;
  }
  var line = s.substring(0, n);
  if (!useSpaces) {
    // insert newlines anywhere
    a.push(line);
    return foldText(s.substring(n), n, useSpaces, a);
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
    return foldText(s.substring(nextIdx), n, useSpaces, a);
  }
}

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
