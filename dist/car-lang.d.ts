declare module "lexer" {
    import { Lexer } from "chevrotain";
    export const tokenLookup: {
        KW_Type: import("chevrotain").TokenType;
        KW_Alias: import("chevrotain").TokenType;
        KW_data: import("chevrotain").TokenType;
        SIGN_EqualsType: import("chevrotain").TokenType;
        SIGN_EqualsData: import("chevrotain").TokenType;
        SIGN_EqualsAlias: import("chevrotain").TokenType;
        SIGN_EqualsOption: import("chevrotain").TokenType;
        SIGN_Or: import("chevrotain").TokenType;
        Annotation: import("chevrotain").TokenType;
        Identifier: import("chevrotain").TokenType;
        GenericIdentifier: import("chevrotain").TokenType;
        ConcreteIdentifier: import("chevrotain").TokenType;
        GenericParameter: import("chevrotain").TokenType;
        FieldName: import("chevrotain").TokenType;
        SIGN_TypeDefStart: import("chevrotain").TokenType;
        CommentBlock: import("chevrotain").TokenType;
        StringLiteral: import("chevrotain").TokenType;
        NumberLiteral: import("chevrotain").TokenType;
        PatternLiteral: import("chevrotain").TokenType;
        Indent: import("chevrotain").TokenType;
        NewLine: import("chevrotain").TokenType;
        EndBlock: import("chevrotain").TokenType;
        MarkdownChapterLiteral: import("chevrotain").TokenType;
        MarkdownCodeLiteral: import("chevrotain").TokenType;
        MarkdownImageLiteral: import("chevrotain").TokenType;
        MarkdownListLiteral: import("chevrotain").TokenType;
        MarkdownParagraphLiteral: import("chevrotain").TokenType;
    };
    export const DomainLexer: Lexer;
}
declare module "parser" {
    import { Parser } from "chevrotain";
    class DomainParser extends Parser {
        START: any;
        EXPRESSION: any;
        TYPE: any;
        TYPE_FIELD: any;
        ALIAS: any;
        ALIAS_FOR: any;
        DATA: any;
        DATA_OPTION: any;
        ROOT_ANNOTATIONS: any;
        ANNOTATIONS: any;
        ANNOTATION: any;
        MARKDOWN_CHAPTER: any;
        MARKDOWN_PARAGRAPH: any;
        MARKDOWN_IMAGE: any;
        MARKDOWN_CODE: any;
        MARKDOWN_LIST: any;
        constructor();
        isAnnotation(): boolean | undefined;
    }
    export const parser: DomainParser;
}
declare module "tchecker" {
    /**
     * This is the type checker. We're going to do "soft" type checking
     * because this tool will mostly be used to do some very soft designing
     * and should not be used in a "hard" environment.
     *
     * Eventually we'll want to do things like code generation, auto-completion
     * plucking of types and most of all show where a change will have impact,
     * so impact analysis and general "tree shaking".
     *
     * Severity can be:
     * 1: "Hint", 2: "Info", 4: "Warning", 8: "Error"
     *
     *
     * @param {AST} ast
     */
    export const typeChecker: (ast?: never[]) => any[];
}
declare module "helpers" {
    /**
     *
     * "startLine": 2,
     * "endLine": 2,
     * "startColumn": 14,
     * "endColumn": 19,
     *
     */
    export const getStartToken: (tokenId: any) => ITokenStart;
    export interface ITokenStart {
        startLineNumber: number;
        endLineNumber: number;
        startColumn: number;
        endColumn: number;
    }
    export const flatten: <T>(items: T[]) => T[];
    export const purge: <T>(items: T[]) => T[];
    export const clone: (source: any) => any;
    /**
     * Fold a long line and intersperse with newlines at certain intervals
     * @param s - input string
     * @param n - number of chars at which to separate lines
     * @param useSpaces - if true, attempt to insert newlines at whitespace
     * @param a - array used to build result, defaults to new array
     */
    export function foldText(s: string, n?: number, useSpaces?: boolean, a?: any[]): any;
    export const baseTypes: string[];
}
declare module "outline" {
    import { ITokenStart } from "helpers";
    const BaseCstVisitorWithDefaults: any;
    export class OutlineVisitor extends BaseCstVisitorWithDefaults {
        tags: any;
        constructor();
        START(ctx: any): any;
        EXPRESSION(ctx: any): IType | IData | IAlias | IComment | null;
        TYPE(ctx: any): IType;
        TYPE_FIELD(ctx: any): ITypeField;
        DATA(ctx: any): IData;
        DATA_OPTION(ctx: any): IDataOption;
        ALIAS(ctx: any): IAlias;
        ALIAS_FOR(ctx: any): IAliasFor;
        GetIdentity(ctx: any): IIdentity;
        MARKDOWN_CHAPTER(ctx: any): IMarkdownChapter;
        MARKDOWN_IMAGE(ctx: any): IMarkdownImage;
        MARKDOWN_PARAGRAPH(ctx: any): IMarkdownParagraph;
        MARKDOWN_CODE(ctx: any): IMarkdownCode;
        MARKDOWN_LIST(ctx: any): IMarkdownList | null;
        ROOT_ANNOTATIONS(ctx: any): IAnnotation[];
        ANNOTATIONS(ctx: any): IAnnotation[];
        ANNOTATION(ctx: any): IAnnotation | null;
    }
    export interface IType {
        type: NodeType;
        id: string;
        params?: string[];
        fields: ITypeField[];
    }
    export interface ITypeField {
        type: NodeType;
        id: string;
        ofType: string[];
        annotations: IAnnotation[];
    }
    export interface IData {
        type: NodeType;
        id: string;
        params?: string[];
        options: IDataOption[];
    }
    export interface IDataOption {
        type: NodeType;
        id: string;
        params?: string[];
    }
    export interface IAlias {
        type: NodeType;
        id: string;
    }
    export interface IComment {
        type: NodeType;
        comment: string;
    }
    export interface IAliasFor {
        ofType: string[];
    }
    export interface IAnnotation {
        type: NodeType;
        key: string;
        value: string;
    }
    export interface IIdentity {
        id: string;
        id_start: ITokenStart;
        params?: string[];
        params_start?: ITokenStart[];
    }
    export interface IMarkdownChapter {
        type: NodeType;
        content: string;
    }
    export interface IMarkdownImage {
        type: NodeType;
        content: string;
        alt: string;
        uri: string;
    }
    export interface IMarkdownCode {
        type: NodeType;
        content: string;
        lang: string;
        source: string;
    }
    export interface IMarkdownParagraph {
        type: NodeType;
        content: string;
    }
    export interface IMarkdownList {
        type: NodeType;
        items: string[];
    }
    enum NodeType {
        TYPE = "TYPE",
        TYPE_FIELD = "TYPE_FIELD",
        ANNOTATION = "ANNOTATION",
        DATA = "DATA",
        DATA_OPTION = "DATA_OPTION",
        ALIAS = "ALIAS",
        COMMENT = "COMMENT",
        CHAPTER = "CHAPTER",
        IMAGE = "IMAGE",
        PARAGRAPH = "PARAGRAPH",
        MARKDOWN_CODE = "MARKDOWN_CODE",
        MARKDOWN_PARAGRAPH = "MARKDOWN_PARAGRAPH",
        MARKDOWN_IMAGE = "MARKDOWN_IMAGE",
        MARKDOWN_CHAPTER = "MARKDOWN_CHAPTER",
        MARKDOWN_LIST = "MARKDOWN_LIST"
    }
}
declare module "transpiler" { }
