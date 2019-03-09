import { ITokenStart } from "./helpers";
declare const BaseCstVisitorWithDefaults: any;
export declare class OutlineVisitor extends BaseCstVisitorWithDefaults {
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
declare enum NodeType {
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
export {};
