"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const lexer_let_1 = require("./lexer.let");
exports.EndBlock = chevrotain_1.createToken({
    name: "EndBlock",
    pattern: /\n(\s*\n)+(?!\s)/,
    push_mode: "root",
    group: chevrotain_1.Lexer.SKIPPED
});
const CommentBlock = chevrotain_1.createToken({
    name: "CommentBlock",
    pattern: /({\*)[^*}]*(\*})(?= *\n)/
});
const KW_Type = chevrotain_1.createToken({
    pattern: /type/,
    name: "KW_Type",
    push_mode: "type_definition"
});
const KW_open = chevrotain_1.createToken({
    pattern: /open/,
    name: "KW_open",
    push_mode: "open_definition"
});
const KW_importing = chevrotain_1.createToken({
    pattern: /importing/,
    name: "KW_importing"
});
const KW_alias = chevrotain_1.createToken({
    pattern: /alias/,
    name: "KW_alias",
    push_mode: "alias_definition"
});
const KW_data = chevrotain_1.createToken({
    pattern: /data/,
    name: "KW_data",
    push_mode: "data_definition"
});
const KW_view = chevrotain_1.createToken({
    pattern: /view/,
    name: "KW_view",
    push_mode: "view_definition"
});
const KW_extends = chevrotain_1.createToken({
    pattern: /extends/,
    name: "KW_extends"
});
const KW_choice = chevrotain_1.createToken({
    pattern: /choice/,
    name: "KW_choice",
    push_mode: "choice_definition"
});
const KW_as = chevrotain_1.createToken({
    pattern: /as/,
    name: "KW_as"
});
const KW_pluck = chevrotain_1.createToken({
    pattern: /pluck/,
    name: "KW_pluck"
});
const SIGN_Equals = chevrotain_1.createToken({
    name: "SIGN_Equals",
    pattern: /=/
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
const SIGN_EqualsData = chevrotain_1.createToken({
    name: "SIGN_EqualsData",
    pattern: /=/,
    push_mode: "data_field_definition"
});
const SIGN_Or = chevrotain_1.createToken({
    name: "SIGN_Or",
    pattern: /\|/
});
const SIGN_Restriction = chevrotain_1.createToken({
    name: "SIGN_Restriction",
    pattern: /\|/
});
const SIGN_TypeDefStart = chevrotain_1.createToken({
    name: "SIGN_TypeDefStart",
    pattern: /:/
});
const SIGN_dot = chevrotain_1.createToken({
    name: "SIGN_dot",
    pattern: /\./
});
const SIGN_open = chevrotain_1.createToken({
    name: "SIGN_open",
    pattern: /{/
});
const SIGN_close = chevrotain_1.createToken({
    name: "SIGN_close",
    pattern: /}/,
    push_mode: "root"
});
const SIGN_collectionOpen = chevrotain_1.createToken({
    name: "SIGN_collectionOpen",
    pattern: /\(/
});
const SIGN_collectionSeparator = chevrotain_1.createToken({
    name: "SIGN_collectionSeparator",
    pattern: /,/
});
const SIGN_collectionClose = chevrotain_1.createToken({
    name: "SIGN_collectionClose",
    pattern: /\)/,
    push_mode: "root"
});
const Identifier = chevrotain_1.createToken({
    name: "Identifier",
    pattern: /[A-Z][a-zA-Z0-9_]*/
});
const ViewIdentifier = chevrotain_1.createToken({
    name: "ViewIdentifier",
    pattern: /[A-Z][a-zA-Z0-9_]*(?= *{)/
});
const ValiableIdentifier = chevrotain_1.createToken({
    name: "ValiableIdentifier",
    pattern: /[a-z][a-zA-Z0-9_]*/
});
const RestrictionIdentifier = chevrotain_1.createToken({
    name: "RestrictionIdentifier",
    pattern: /[a-z][a-zA-Z0-9_]*(?= +)/
});
const GenericIdentifier = chevrotain_1.createToken({
    name: "GenericIdentifier",
    pattern: /[A-Z][a-zA-Z0-9_]*(?= +[a-z])/
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
    pattern: /( {4})/,
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
const BooleanLiteral = chevrotain_1.createToken({
    name: "BooleanLiteral",
    pattern: /True|False/
});
const DirectiveLiteral = chevrotain_1.createToken({
    name: "DirectiveLiteral",
    pattern: /(%{2})([^%]*)(%{2})|%.*\n/
});
const PragmaLiteral = chevrotain_1.createToken({
    name: "PragmaLiteral",
    pattern: /(#{2})([^#]*)(#{2})|#.*\n/
});
const AnnotationLiteral = chevrotain_1.createToken({
    name: "AnnotationLiteral",
    pattern: /(@{2})([^@]*)(@{2})|@.*\n/
});
const Operator = chevrotain_1.createToken({
    name: "Operator",
    pattern: /[\+\-\*%#\|\\\/&\^!\.><@]+/
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
/* OPEN DEFINITION */
/* SYSTEM TOKENS - END */
const multiModeLexerDefinition = {
    modes: {
        root: [
            KW_Type,
            KW_alias,
            KW_data,
            KW_choice,
            KW_view,
            KW_pluck,
            KW_open,
            lexer_let_1.KW_let,
            AnnotationLiteral,
            exports.EndBlock,
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
            exports.EndBlock,
            WhiteSpace,
            CommentBlock
        ],
        type_field_definition: [
            exports.EndBlock,
            Indent,
            AnnotationLiteral,
            FieldName,
            SIGN_TypeDefStart,
            SIGN_Restriction,
            SIGN_dot,
            KW_pluck,
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
            exports.EndBlock,
            Indent,
            AnnotationLiteral,
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
            exports.EndBlock,
            WhiteSpace,
            CommentBlock
        ],
        data_field_definition: [
            exports.EndBlock,
            AnnotationLiteral,
            SIGN_Or,
            GenericIdentifier,
            Identifier,
            GenericParameter,
            NewLine,
            Indent,
            exports.EndBlock,
            WhiteSpace,
            CommentBlock
        ],
        view_definition: [
            exports.EndBlock,
            StringLiteral,
            KW_as,
            SIGN_open,
            SIGN_close,
            DirectiveLiteral,
            ViewIdentifier,
            Identifier,
            NewLine,
            Indent,
            exports.EndBlock,
            WhiteSpace,
            CommentBlock
        ],
        choice_definition: [
            exports.EndBlock,
            SIGN_Or,
            SIGN_Equals,
            Indent,
            Identifier,
            StringLiteral,
            NumberLiteral,
            NewLine,
            WhiteSpace,
            CommentBlock
        ],
        open_definition: [
            Identifier,
            KW_importing,
            SIGN_dot,
            SIGN_collectionOpen,
            SIGN_collectionSeparator,
            SIGN_collectionClose
        ],
        let_definition: lexer_let_1.let_definition
    },
    defaultMode: "root"
};
let baseTokenLookup = {
    // keywords
    KW_Type,
    KW_alias,
    KW_data,
    KW_extends,
    KW_view,
    KW_choice,
    KW_pluck,
    KW_open,
    KW_importing,
    SIGN_Equals,
    SIGN_EqualsType,
    SIGN_EqualsData,
    SIGN_EqualsAlias,
    SIGN_Or,
    SIGN_Restriction,
    SIGN_dot,
    SIGN_open,
    SIGN_close,
    SIGN_collectionClose,
    SIGN_collectionOpen,
    SIGN_collectionSeparator,
    Operator,
    AnnotationLiteral,
    Identifier,
    ViewIdentifier,
    ValiableIdentifier,
    GenericIdentifier,
    GenericParameter,
    RestrictionIdentifier,
    FieldName,
    SIGN_TypeDefStart,
    CommentBlock,
    DirectiveLiteral,
    PragmaLiteral,
    BooleanLiteral,
    StringLiteral,
    NumberLiteral,
    PatternLiteral,
    Indent,
    NewLine,
    EndBlock: exports.EndBlock,
    MarkdownChapterLiteral,
    MarkdownCodeLiteral,
    MarkdownImageLiteral,
    MarkdownListLiteral,
    MarkdownParagraphLiteral
};
lexer_let_1.modTokens(baseTokenLookup);
exports.tokenLookup = baseTokenLookup;
exports.DomainLexer = new chevrotain_1.Lexer(multiModeLexerDefinition);
// selfService / Household / Calculate Estimate Consumption
//# sourceMappingURL=lexer.js.map