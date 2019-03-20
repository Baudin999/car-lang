import { createToken } from "chevrotain";

export const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
export const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /(["'])(?:(?=(\\?))\2.)*?\1/
});
export const PatternLiteral = createToken({
  name: "PatternLiteral",
  pattern: /\/.+\//
});
