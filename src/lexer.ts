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

const KW_Alias = createToken({
  pattern: /alias/,
  name: "KW_Alias",
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

const SIGN_TypeDefStart = createToken({
  name: "SIGN_TypeDefStart",
  pattern: /:/
});

const Identifier = createToken({
  name: "Identifier",
  pattern: /[A-Z][a-zA-Z0-9_]*/
});

const RestrictionIdentifier = createToken({
  name: "RestrictionIdentifier",
  pattern: /[a-z][a-zA-Z0-9_]*(?= +)/
});

const GenericIdentifier = createToken({
  name: "GenericIdentifier",
  pattern: /[A-Z][a-zA-Z0-9_]*(?= +[a-z])/
});

const ConcreteIdentifier = createToken({
  name: "ConcreteIdentifier",
  pattern: /[A-Z][a-zA-Z0-9_]*(?= +[A-Z])/
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
  pattern: /( {2})\s*/,
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
  pattern: /(?![ ]+\*).(.|\n\r?\w)*/
});

/* SYSTEM TOKENS - END */

const multiModeLexerDefinition = {
  modes: {
    root: [
      KW_Type,
      KW_Alias,
      KW_data,
      KW_let,
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
      GenericParameter,
      GenericIdentifier,
      ConcreteIdentifier,
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
      SIGN_EqualsAlias,
      Indent,
      ConcreteIdentifier,
      GenericIdentifier,
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
    ],
    restriction_field_definition: [
      SIGN_Or,
      Annotation,
      RestrictionIdentifier,
      EndBlock,
      CommentBlock
    ],
    let_definition: [StringLiteral, NumberLiteral, PatternLiteral]
  },

  defaultMode: "root"
};

export const tokenLookup = {
  // keywords
  KW_Type,
  KW_Alias,
  KW_data,

  SIGN_EqualsType,
  SIGN_EqualsData,
  SIGN_EqualsAlias,
  SIGN_EqualsOption,
  SIGN_Or,

  Annotation,
  Identifier,
  GenericIdentifier,
  ConcreteIdentifier,
  GenericParameter,
  FieldName,
  SIGN_TypeDefStart,

  CommentBlock,

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
