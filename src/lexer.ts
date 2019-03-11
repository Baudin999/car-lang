import { createToken, Lexer } from "chevrotain";

const EndBlock = createToken({
  name: "EndBlock",
  pattern: /\n(\s*\n)+(?!\s)/,
  push_mode: "root",
  group: Lexer.SKIPPED
});

const CommentBlock = createToken({
  name: "CommentBlock",
  pattern: /({\*)[^*}]*(\*})(?= *\n)/
});

const Annotation = createToken({
  name: "Annotation",
  pattern: /(@) *([a-z][a-zA-Z0-9_-]* *:)?(.+)\n/
});

const KW_Type = createToken({
  pattern: /type/,
  name: "KW_Type",
  push_mode: "type_definition"
});

const KW_alias = createToken({
  pattern: /alias/,
  name: "KW_alias",
  push_mode: "alias_definition"
});

const KW_data = createToken({
  pattern: /data/,
  name: "KW_data",
  push_mode: "data_definition"
});

const KW_let = createToken({
  pattern: /let/,
  name: "KW_let",
  push_mode: "let_definition"
});

const KW_extends = createToken({
  pattern: /extends/,
  name: "KW_extends"
});

const KW_option = createToken({
  pattern: /option/,
  name: "KW_option"
});

const SIGN_Equals = createToken({
  name: "SIGN_Equals",
  pattern: /=/
});

const SIGN_EqualsType = createToken({
  name: "SIGN_EqualsType",
  pattern: /=/,
  push_mode: "type_field_definition"
});

const SIGN_EqualsAlias = createToken({
  name: "SIGN_EqualsAlias",
  pattern: /=/
});

const SIGN_EqualsOption = createToken({
  name: "SIGN_EqualsOption",
  pattern: /=/,
  push_mode: "option_field_definition"
});

const SIGN_EqualsData = createToken({
  name: "SIGN_EqualsData",
  pattern: /=/,
  push_mode: "data_field_definition"
});

const SIGN_Or = createToken({
  name: "SIGN_Or",
  pattern: /\|/
});

const SIGN_Restriction = createToken({
  name: "SIGN_Restriction",
  pattern: /\|/
});

const SIGN_TypeDefStart = createToken({
  name: "SIGN_TypeDefStart",
  pattern: /:/
});

const SIGN_dot = createToken({
  name: "SIGN_dot",
  pattern: /\./
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[A-Z][a-zA-Z0-9_]*/
});

const ValiableIdentifier = createToken({
  name: "ValiableIdentifier",
  pattern: /[a-z][a-zA-Z0-9_]*/
});

const RestrictionIdentifier = createToken({
  name: "RestrictionIdentifier",
  pattern: /[a-z][a-zA-Z0-9_]*(?= +)/
});

const GenericIdentifier = createToken({
  name: "GenericIdentifier",
  pattern: /[A-Z][a-zA-Z0-9_]*(?= +[a-z])/
});

const GenericParameter = createToken({
  name: "GenericParameter",
  pattern: /[a-z][a-zA-Z0-9_]*/
});

const FieldName = createToken({
  name: "FieldName",
  pattern: /[A-Z][a-zA-Z0-9_]*(?= *:)/
});

const NewLine = createToken({
  name: "NewLine",
  pattern: /\n(?=\s+)/,
  group: Lexer.SKIPPED
});

const Indent = createToken({
  pattern: /( {4})/,
  name: "Indent"
});

const WhiteSpace = createToken({
  pattern: /\s/,
  name: "WhiteSpace",
  group: Lexer.SKIPPED
});

/* VALUE LITERALS */

const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /(["'])(?:(?=(\\?))\2.)*?\1/
});
const PatternLiteral = createToken({
  name: "PatternLiteral",
  pattern: /\/.+\//
});
const BooleanLiteral = createToken({
  name: "BooleanLiteral",
  pattern: /True|False/
});

const Operator = createToken({
  name: "Operator",
  pattern: /[\+\-\*%#\|\\\/&\^!\.><@]+/
});

/* MARKDOWN */

const MarkdownImageLiteral = createToken({
  name: "MarkdownImageLiteral",
  pattern: /\[.*\]\(.*\)(?= *\n)/
});

const MarkdownCodeLiteral = createToken({
  name: "MarkdownCodeLiteral",
  pattern: /(`{3})([^`]*)(`{3})(?= *\n)/
});

const MarkdownChapterLiteral = createToken({
  name: "MarkdownChapterLiteral",
  pattern: /#+ .*(?= *\n)/
});

const MarkdownListLiteral = createToken({
  name: "MarkdownListLiteral",
  pattern: /([ \t]+\*.*\n?)+/
});

const MarkdownParagraphLiteral = createToken({
  name: "MarkdownParagraphLiteral",
  pattern: /(?=[ ]+\*).(.|\n\r?\w)*/
});

/* LET DEFINITION */

const FunctionIdentifier = createToken({
  name: "FunctionIdentifier",
  pattern: /(?=let +)[a-z][a-zA-Z0-9_]*(?= +)/
});

const FunctionParameter = createToken({
  name: "FunctionParameter",
  pattern: /[a-z][a-zA-Z0-9_]*(?= +)/
});

/* SYSTEM TOKENS - END */

const multiModeLexerDefinition = {
  modes: {
    root: [
      KW_Type,
      KW_alias,
      KW_data,
      //KW_let,
      Annotation,
      EndBlock,
      CommentBlock,
      MarkdownChapterLiteral,
      MarkdownCodeLiteral,
      MarkdownImageLiteral,
      MarkdownListLiteral,
      MarkdownParagraphLiteral
    ],
    type_definition: [
      KW_extends,
      SIGN_EqualsType,
      GenericParameter,
      GenericIdentifier,
      Identifier,
      EndBlock,
      WhiteSpace,
      CommentBlock
    ],
    type_field_definition: [
      EndBlock,
      Indent,
      Annotation,
      FieldName,
      SIGN_TypeDefStart,
      SIGN_Restriction,
      RestrictionIdentifier,
      GenericParameter,
      GenericIdentifier,
      BooleanLiteral,
      StringLiteral,
      NumberLiteral,
      PatternLiteral,
      Identifier,
      NewLine,
      WhiteSpace,
      CommentBlock
    ],
    alias_definition: [
      EndBlock,
      Indent,
      Annotation,
      SIGN_EqualsAlias,
      SIGN_Restriction,
      GenericIdentifier,
      RestrictionIdentifier,
      BooleanLiteral,
      StringLiteral,
      NumberLiteral,
      PatternLiteral,
      Identifier,
      NewLine,
      WhiteSpace,
      CommentBlock
    ],
    data_definition: [
      SIGN_EqualsData,
      GenericParameter,
      GenericIdentifier,
      Identifier,
      EndBlock,
      WhiteSpace,
      CommentBlock
    ],
    data_field_definition: [
      EndBlock,
      Annotation,
      SIGN_Or,
      GenericIdentifier,
      Identifier,
      GenericParameter,
      NewLine,
      Indent,
      EndBlock,
      WhiteSpace,
      CommentBlock
    ]
    // restriction_field_definition: [
    //   SIGN_Or,
    //   Annotation,
    //   RestrictionIdentifier,
    //   EndBlock,
    //   CommentBlock
    // ],
    // let_definition: [
    //   ValiableIdentifier,
    //   SIGN_Equals,
    //   SIGN_dot,
    //   StringLiteral,
    //   Operator,
    //   NumberLiteral,
    //   PatternLiteral,
    //   EndBlock
    // ]
  },

  defaultMode: "root"
};

export const tokenLookup = {
  // keywords
  KW_Type,
  KW_alias,
  KW_data,
  KW_extends,
  KW_let,

  SIGN_Equals,
  SIGN_EqualsType,
  SIGN_EqualsData,
  SIGN_EqualsAlias,
  SIGN_EqualsOption,
  SIGN_Or,
  SIGN_Restriction,
  SIGN_dot,
  Operator,

  Annotation,
  Identifier,
  ValiableIdentifier,
  GenericIdentifier,
  GenericParameter,
  RestrictionIdentifier,
  FieldName,
  SIGN_TypeDefStart,

  CommentBlock,

  BooleanLiteral,
  StringLiteral,
  NumberLiteral,
  PatternLiteral,

  Indent,
  NewLine,
  EndBlock,

  MarkdownChapterLiteral,
  MarkdownCodeLiteral,
  MarkdownImageLiteral,
  MarkdownListLiteral,
  MarkdownParagraphLiteral
};

export const DomainLexer = new Lexer(multiModeLexerDefinition);

// selfService / Household / Calculate Estimate Consumption
