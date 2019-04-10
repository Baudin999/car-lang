import { createToken, Lexer } from "chevrotain";
import { KW_let, let_definition } from "./lexer.let";

export const EndBlock = createToken({
    name: "EndBlock",
    pattern: /\n(\s*\n)+(?!\s)/,
    push_mode: "root" //,
    //group: Lexer.SKIPPED
});

const CommentBlock = createToken({
    name: "CommentBlock",
    pattern: /({\*)[^*}]*(\*})(?= *\n)/
});

const KW_type = createToken({
    pattern: /type/,
    name: "KW_type",
    push_mode: "type_definition"
});

const KW_open = createToken({
    pattern: /open/,
    name: "KW_open",
    push_mode: "open_definition"
});

const KW_importing = createToken({
    pattern: /importing/,
    name: "KW_importing"
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

const KW_view = createToken({
    pattern: /view/,
    name: "KW_view",
    push_mode: "view_definition"
});

const KW_extends = createToken({
    pattern: /extends/,
    name: "KW_extends"
});

const KW_choice = createToken({
    pattern: /choice/,
    name: "KW_choice",
    push_mode: "choice_definition"
});

const KW_aggregate = createToken({
    pattern: /aggregate/,
    name: "KW_aggregate",
    push_mode: "aggregate_definition"
});

const KW_as = createToken({
    pattern: /as/,
    name: "KW_as"
});

const KW_flow = createToken({
    pattern: /flow/,
    name: "KW_flow",
    push_mode: "flow_definition"
});

const KW_pluck = createToken({
    pattern: /pluck/,
    name: "KW_pluck"
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

const SIGN_open = createToken({
    name: "SIGN_open",
    pattern: /{/
});

const SIGN_close = createToken({
    name: "SIGN_close",
    pattern: /}/,
    push_mode: "root"
});

const SIGN_collectionOpen = createToken({
    name: "SIGN_collectionOpen",
    pattern: /\(/
});

const SIGN_collectionSeparator = createToken({
    name: "SIGN_collectionSeparator",
    pattern: /,/
});

const SIGN_collectionClose = createToken({
    name: "SIGN_collectionClose",
    pattern: /\)/,
    push_mode: "root"
});

const SIGN_wrapOpen = createToken({
    name: "SIGN_wrapOpen",
    pattern: /\(/
});

const SIGN_wrapClose = createToken({
    name: "SIGN_wrapClose",
    pattern: /\)/
});

const SIGN_arrow = createToken({
    name: "SIGN_arrow",
    pattern: /->/
});

const Identifier = createToken({
    name: "Identifier",
    pattern: /[A-Z][a-zA-Z0-9_]*/
});

const ViewIdentifier = createToken({
    name: "ViewIdentifier",
    pattern: /[A-Z][a-zA-Z0-9_]*(?= *{)/
});

const VariableIdentifier = createToken({
    name: "VariableIdentifier",
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
const DirectiveLiteral = createToken({
    name: "DirectiveLiteral",
    pattern: /[ \n\t]*%.*\n/
});
const PragmaLiteral = createToken({
    name: "PragmaLiteral",
    pattern: /[ \n\t]*#.*\n/
});
const AnnotationLiteral = createToken({
    name: "AnnotationLiteral",
    pattern: / *@.*\n/
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
    pattern: /(?![ ]+\*).(.|\n\r?\w)*/
});

/* OPEN DEFINITION */

/* SYSTEM TOKENS - END */

const multiModeLexerDefinition = {
    modes: {
        root: [
            KW_type,
            KW_alias,
            KW_data,
            KW_choice,
            KW_view,
            KW_pluck,
            KW_open,
            KW_let,
            KW_aggregate,
            KW_flow,
            SIGN_close,
            AnnotationLiteral,
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
            AnnotationLiteral,
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
            WhiteSpace,
            CommentBlock
        ],
        alias_definition: [
            EndBlock,
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
            EndBlock,
            WhiteSpace,
            CommentBlock
        ],
        data_field_definition: [
            EndBlock,
            AnnotationLiteral,
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
        view_definition: [
            EndBlock,
            StringLiteral,
            KW_as,
            SIGN_open,
            SIGN_close,
            DirectiveLiteral,
            ViewIdentifier,
            Identifier,
            NewLine,
            Indent,
            EndBlock,
            WhiteSpace,
            CommentBlock
        ],
        choice_definition: [
            EndBlock,
            AnnotationLiteral,
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
        let_definition,
        aggregate_definition: [
            KW_type,
            KW_alias,
            KW_data,
            KW_choice,
            KW_pluck,
            StringLiteral,
            KW_as,
            SIGN_open,
            SIGN_close,
            DirectiveLiteral,
            ViewIdentifier,
            Identifier,
            NewLine,
            Indent,
            WhiteSpace,
            CommentBlock
        ],
        flow_definition: [
            ViewIdentifier,
            SIGN_open,
            SIGN_close,
            SIGN_arrow,
            SIGN_TypeDefStart,
            SIGN_wrapOpen,
            SIGN_wrapClose,
            AnnotationLiteral,
            DirectiveLiteral,
            GenericIdentifier,
            GenericParameter,
            Identifier,
            NewLine,
            Indent,
            WhiteSpace,
            CommentBlock
        ]
    },

    defaultMode: "root"
};

export const tokenLookup = {
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
    KW_flow,

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
    EndBlock,

    MarkdownChapterLiteral,
    MarkdownCodeLiteral,
    MarkdownImageLiteral,
    MarkdownListLiteral,
    MarkdownParagraphLiteral
};
export const DomainLexer = new Lexer(multiModeLexerDefinition);

// selfService / Household / Calculate Estimate Consumption
