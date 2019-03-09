"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const EndBlock = chevrotain_1.createToken({
    name: "EndBlock",
    pattern: /\n(\s*\n)+(?!\s)/,
    push_mode: "root",
    group: chevrotain_1.Lexer.SKIPPED
});
const CommentBlock = chevrotain_1.createToken({
    name: "CommentBlock",
    pattern: /({\*)[^*}]*(\*})(?= *\n)/
});
const Annotation = chevrotain_1.createToken({
    name: "Annotation",
    pattern: /(@) *([a-z][a-zA-Z0-9_-]* *:)?(.+)\n/
});
const KW_Type = chevrotain_1.createToken({
    pattern: /type/,
    name: "KW_Type",
    push_mode: "type_definition"
});
const KW_Alias = chevrotain_1.createToken({
    pattern: /alias/,
    name: "KW_Alias",
    push_mode: "alias_definition"
});
const KW_data = chevrotain_1.createToken({
    pattern: /data/,
    name: "KW_data",
    push_mode: "data_definition"
});
const KW_let = chevrotain_1.createToken({
    pattern: /let/,
    name: "KW_let",
    push_mode: "let_definition"
});
const SIGN_EqualsType = chevrotain_1.createToken({
    name: "SIGN_EqualsType",
    pattern: /=/,
    push_mode: "type_field_definition"
});
const SIGN_EqualsAlias = chevrotain_1.createToken({
    name: "SIGN_EqualsAlias",
    pattern: /=/
});
const SIGN_EqualsOption = chevrotain_1.createToken({
    name: "SIGN_EqualsOption",
    pattern: /=/,
    push_mode: "option_field_definition"
});
const SIGN_EqualsData = chevrotain_1.createToken({
    name: "SIGN_EqualsData",
    pattern: /=/,
    push_mode: "data_field_definition"
});
const SIGN_Or = chevrotain_1.createToken({
    name: "SIGN_Or",
    pattern: /\|/
});
const SIGN_TypeDefStart = chevrotain_1.createToken({
    name: "SIGN_TypeDefStart",
    pattern: /:/
});
const Identifier = chevrotain_1.createToken({
    name: "Identifier",
    pattern: /[A-Z][a-zA-Z0-9_]*/
});
const RestrictionIdentifier = chevrotain_1.createToken({
    name: "RestrictionIdentifier",
    pattern: /[a-z][a-zA-Z0-9_]*(?= +)/
});
const GenericIdentifier = chevrotain_1.createToken({
    name: "GenericIdentifier",
    pattern: /[A-Z][a-zA-Z0-9_]*(?= +[a-z])/
});
const ConcreteIdentifier = chevrotain_1.createToken({
    name: "ConcreteIdentifier",
    pattern: /[A-Z][a-zA-Z0-9_]*(?= +[A-Z])/
});
const GenericParameter = chevrotain_1.createToken({
    name: "GenericParameter",
    pattern: /[a-z][a-zA-Z0-9_]*/
});
const FieldName = chevrotain_1.createToken({
    name: "FieldName",
    pattern: /[A-Z][a-zA-Z0-9_]*(?= *:)/
});
const NewLine = chevrotain_1.createToken({
    name: "NewLine",
    pattern: /\n(?=\s+)/,
    group: chevrotain_1.Lexer.SKIPPED
});
const Indent = chevrotain_1.createToken({
    pattern: /( {2})\s*/,
    name: "Indent"
});
const WhiteSpace = chevrotain_1.createToken({
    pattern: /\s/,
    name: "WhiteSpace",
    group: chevrotain_1.Lexer.SKIPPED
});
/* VALUE LITERALS */
const NumberLiteral = chevrotain_1.createToken({
    name: "NumberLiteral",
    pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
const StringLiteral = chevrotain_1.createToken({
    name: "StringLiteral",
    pattern: /(["'])(?:(?=(\\?))\2.)*?\1/
});
const PatternLiteral = chevrotain_1.createToken({
    name: "PatternLiteral",
    pattern: /\/.+\//
});
/* MARKDOWN */
const MarkdownImageLiteral = chevrotain_1.createToken({
    name: "MarkdownImageLiteral",
    pattern: /\[.*\]\(.*\)(?= *\n)/
});
const MarkdownCodeLiteral = chevrotain_1.createToken({
    name: "MarkdownCodeLiteral",
    pattern: /(`{3})([^`]*)(`{3})(?= *\n)/
});
const MarkdownChapterLiteral = chevrotain_1.createToken({
    name: "MarkdownChapterLiteral",
    pattern: /#+ .*(?= *\n)/
});
const MarkdownListLiteral = chevrotain_1.createToken({
    name: "MarkdownListLiteral",
    pattern: /([ \t]+\*.*\n?)+/
});
const MarkdownParagraphLiteral = chevrotain_1.createToken({
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
exports.tokenLookup = {
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
exports.DomainLexer = new chevrotain_1.Lexer(multiModeLexerDefinition);
// selfService / Household / Calculate Estimate Consumption
//# sourceMappingURL=lexer.js.map