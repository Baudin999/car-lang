"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
exports.EndBlock = chevrotain_1.createToken({
    name: "EndBlock",
    pattern: /\n(\s*\n)+(?!\s)/,
    push_mode: "root"
});
const CommentBlock = chevrotain_1.createToken({
    name: "CommentBlock",
    pattern: /\w*({\*)[^}]*(\*})/
});
const KW_type = chevrotain_1.createToken({
    pattern: /type/,
    name: "KW_type",
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
const KW_aggregate = chevrotain_1.createToken({
    pattern: /aggregate/,
    name: "KW_aggregate",
    push_mode: "aggregate_definition"
});
const KW_as = chevrotain_1.createToken({
    pattern: /as/,
    name: "KW_as"
});
const KW_guideline = chevrotain_1.createToken({
    pattern: /guideline/,
    name: "KW_guideline",
    push_mode: "guideline_definition"
});
const KW_flow = chevrotain_1.createToken({
    pattern: /flow/,
    name: "KW_flow",
    push_mode: "flow_definition"
});
const KW_map = chevrotain_1.createToken({
    pattern: /map/,
    name: "KW_map",
    push_mode: "map_definition"
});
const KW_pluck = chevrotain_1.createToken({
    pattern: /pluck/,
    name: "KW_pluck"
});
const KW_sub = chevrotain_1.createToken({
    pattern: /sub/,
    name: "KW_sub"
});
const KW_pub = chevrotain_1.createToken({
    pattern: /pub/,
    name: "KW_pub"
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
    pop_mode: true
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
const SIGN_wrapOpen = chevrotain_1.createToken({
    name: "SIGN_wrapOpen",
    pattern: /\(/
});
const SIGN_wrapClose = chevrotain_1.createToken({
    name: "SIGN_wrapClose",
    pattern: /\)/
});
const SIGN_arrow = chevrotain_1.createToken({
    name: "SIGN_arrow",
    pattern: /->/
});
const SIGN_fireAndForget = chevrotain_1.createToken({
    name: "SIGN_fireAndForget",
    pattern: /\*/
});
const Identifier = chevrotain_1.createToken({
    name: "Identifier",
    pattern: /[A-Z][a-zA-Z0-9_]*/
});
const ViewIdentifier = chevrotain_1.createToken({
    name: "ViewIdentifier",
    pattern: /[A-Z][a-zA-Z0-9_]*(?= *{)/
});
const VariableIdentifier = chevrotain_1.createToken({
    name: "VariableIdentifier",
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
    pattern: /\s*\n(?=\s+)/,
    group: chevrotain_1.Lexer.SKIPPED
});
const Indent = chevrotain_1.createToken({
    pattern: /( {4})|\t/,
    name: "Indent"
});
const WhiteSpace = chevrotain_1.createToken({
    pattern: /\s+/,
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
    pattern: /[ \n\t]*%.*\n/
});
const PragmaLiteral = chevrotain_1.createToken({
    name: "PragmaLiteral",
    pattern: /[ \n\t]*#.*\n/
});
const AnnotationLiteral = chevrotain_1.createToken({
    name: "AnnotationLiteral",
    pattern: /\w*@.*\n/
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
    pattern: /(`{3})([^`{3}]*)(`{3})(?= *\n)/
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
            CommentBlock,
            KW_type,
            KW_alias,
            KW_data,
            KW_choice,
            KW_view,
            KW_pluck,
            KW_open,
            KW_aggregate,
            KW_flow,
            KW_map,
            KW_guideline,
            SIGN_close,
            AnnotationLiteral,
            exports.EndBlock,
            MarkdownChapterLiteral,
            MarkdownCodeLiteral,
            MarkdownImageLiteral,
            MarkdownListLiteral,
            MarkdownParagraphLiteral,
            NewLine,
            WhiteSpace
        ],
        type_definition: [
            CommentBlock,
            exports.EndBlock,
            KW_extends,
            AnnotationLiteral,
            SIGN_EqualsType,
            GenericParameter,
            GenericIdentifier,
            Identifier,
            WhiteSpace
        ],
        type_field_definition: [
            CommentBlock,
            exports.EndBlock,
            AnnotationLiteral,
            Indent,
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
            WhiteSpace
        ],
        alias_definition: [
            CommentBlock,
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
            WhiteSpace
        ],
        data_definition: [
            CommentBlock,
            SIGN_EqualsData,
            GenericParameter,
            GenericIdentifier,
            Identifier,
            exports.EndBlock,
            WhiteSpace
        ],
        data_field_definition: [
            CommentBlock,
            exports.EndBlock,
            AnnotationLiteral,
            SIGN_Or,
            GenericIdentifier,
            Identifier,
            GenericParameter,
            NewLine,
            Indent,
            exports.EndBlock,
            WhiteSpace
        ],
        view_definition: [
            CommentBlock,
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
            WhiteSpace
        ],
        choice_definition: [
            CommentBlock,
            exports.EndBlock,
            AnnotationLiteral,
            SIGN_Or,
            SIGN_Equals,
            Indent,
            Identifier,
            StringLiteral,
            NumberLiteral,
            NewLine,
            WhiteSpace
        ],
        open_definition: [
            Identifier,
            KW_importing,
            SIGN_dot,
            SIGN_collectionOpen,
            SIGN_collectionSeparator,
            SIGN_collectionClose,
            WhiteSpace,
            NewLine
        ],
        aggregate_definition: [
            KW_type,
            KW_alias,
            KW_data,
            KW_choice,
            KW_pluck,
            KW_as,
            SIGN_open,
            SIGN_close,
            SIGN_wrapOpen,
            SIGN_wrapClose,
            SIGN_TypeDefStart,
            SIGN_arrow,
            SIGN_fireAndForget,
            AnnotationLiteral,
            StringLiteral,
            DirectiveLiteral,
            ViewIdentifier,
            Identifier,
            GenericIdentifier,
            GenericParameter,
            NewLine,
            Indent,
            WhiteSpace,
            CommentBlock
        ],
        flow_definition: [
            ViewIdentifier,
            KW_sub,
            KW_pub,
            SIGN_open,
            SIGN_close,
            SIGN_arrow,
            SIGN_TypeDefStart,
            SIGN_wrapOpen,
            SIGN_wrapClose,
            SIGN_collectionSeparator,
            SIGN_fireAndForget,
            AnnotationLiteral,
            DirectiveLiteral,
            GenericIdentifier,
            GenericParameter,
            StringLiteral,
            Identifier,
            NewLine,
            Indent,
            WhiteSpace,
            CommentBlock
        ],
        map_definition: [
            Identifier,
            StringLiteral,
            SIGN_open,
            SIGN_close,
            SIGN_arrow,
            NewLine,
            WhiteSpace
        ],
        guideline_definition: [
            SIGN_open,
            WhiteSpace,
            SIGN_close,
            DirectiveLiteral,
            MarkdownChapterLiteral,
            MarkdownCodeLiteral,
            MarkdownImageLiteral,
            MarkdownListLiteral,
            MarkdownParagraphLiteral,
            NewLine
        ]
    },
    defaultMode: "root"
};
exports.tokenLookup = {
    // keywords
    KW_type,
    KW_alias,
    KW_data,
    KW_extends,
    KW_view,
    KW_choice,
    KW_pluck,
    KW_open,
    KW_importing,
    KW_aggregate,
    KW_guideline,
    KW_flow,
    KW_map,
    KW_sub,
    KW_pub,
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
    SIGN_arrow,
    SIGN_TypeDefStart,
    SIGN_wrapOpen,
    SIGN_wrapClose,
    SIGN_fireAndForget,
    Operator,
    AnnotationLiteral,
    Identifier,
    ViewIdentifier,
    VariableIdentifier,
    GenericIdentifier,
    GenericParameter,
    RestrictionIdentifier,
    FieldName,
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
exports.DomainLexer = new chevrotain_1.Lexer(multiModeLexerDefinition);
// selfService / Household / Calculate Estimate Consumption
//# sourceMappingURL=lexer.js.map