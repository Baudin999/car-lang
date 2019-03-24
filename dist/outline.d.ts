import { ITokenStart } from "./helpers";
declare const BaseCstVisitorWithDefaults: any;
export declare class OutlineVisitor extends BaseCstVisitorWithDefaults {
    modules: any;
    constructor(modules?: any);
    START(ctx: any): IExpression[];
    EXPRESSION(ctx: any): IExpression | null;
    OPEN(ctx: any): IOpen;
    IMPORTING(ctx: any): string[];
    TYPE(ctx: any): IType;
    TYPE_FIELD(ctx: any): ITypeField | IPluckedField;
    DATA(ctx: any): IData;
    DATA_OPTION(ctx: any): IDataOption;
    ALIAS(ctx: any): IAlias;
    VIEW(ctx: any): IView;
    CHOICE(ctx: any): IChoice;
    CHOICE_OPTION(ctx: any): any;
    IDENTIFIER(ctx: any): IIdentity;
    TYPE_IDENTIFIER(ctx: any): {
        ofType: any;
        ofType_start: any;
        ofType_params: any;
        ofType_params_start: any;
    };
    RESTRICTION(ctx: any): IRestriction;
    MARKDOWN_CHAPTER(ctx: any): IMarkdownChapter;
    MARKDOWN_IMAGE(ctx: any): IMarkdownImage;
    MARKDOWN_PARAGRAPH(ctx: any): IMarkdownParagraph;
    MARKDOWN_CODE(ctx: any): IMarkdownCode;
    MARKDOWN_LIST(ctx: any): IMarkdownList | null;
    ROOT_ANNOTATIONS(ctx: any): IAnnotation[];
    ANNOTATIONS(ctx: any): IAnnotation[];
    ANNOTATION(ctx: any): IAnnotation | null;
}
export interface IOpen {
    type: NodeType;
    module: string;
    imports: string[];
}
export interface IType {
    type: NodeType;
    id: string;
    extends: string[];
    extends_start: ITokenStart[];
    params?: string[];
    fields: (ITypeField | IPluckedField)[];
    source?: string;
    annotations: IAnnotation[];
    imported?: boolean;
}
export interface ITypeField {
    type: NodeType;
    id: string;
    ofType: string;
    ofType_start: ITokenStart;
    ofType_params: string[];
    ofType_params_start: ITokenStart[];
    annotations: IAnnotation[];
    source?: string;
    restrictions: IRestriction[];
}
export interface IPluckedField {
    type: NodeType;
    parts: string[];
    parts_start: ITokenStart[];
}
export interface IData {
    type: NodeType;
    id: string;
    params?: string[];
    options: IDataOption[];
    annotations: IAnnotation[];
}
export interface IDataOption {
    type: NodeType;
    id: string;
    params?: string[];
    annotations: IAnnotation[];
}
export interface IView {
    type: NodeType;
    id?: string;
    nodes: string[];
    directives: IDirective[];
}
export interface IAlias {
    type: NodeType;
    id: string;
    ofType: string;
    ofType_start: ITokenStart;
    ofType_params: string[];
    ofType_params_start: ITokenStart[];
    annotations: IAnnotation[];
    source?: string;
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
export interface IDirective {
    key: string;
    value: string;
}
export interface IIdentity {
    id: string;
    id_start: ITokenStart;
    params?: string[];
    params_start?: ITokenStart[];
}
export interface IChoice {
    type: string;
    id: string;
    id_start: ITokenStart;
    options: string[];
    options_start: ITokenStart[];
}
export interface IRestriction {
    key: string;
    value: string | number | boolean;
}
export interface IMarkdownChapter {
    type: NodeType;
    content: string;
    depth: number;
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
export declare type IExpression = IType | IAlias | IData | IComment | IMarkdownChapter | IMarkdownCode | IMarkdownImage | IMarkdownList | IMarkdownParagraph;
export declare enum NodeType {
    TYPE = "TYPE",
    TYPE_FIELD = "TYPE_FIELD",
    ANNOTATION = "ANNOTATION",
    DATA = "DATA",
    DATA_OPTION = "DATA_OPTION",
    ALIAS = "ALIAS",
    COMMENT = "COMMENT",
    CHAPTER = "CHAPTER",
    IMAGE = "IMAGE",
    VIEW = "VIEW",
    PARAGRAPH = "PARAGRAPH",
    MARKDOWN_CODE = "MARKDOWN_CODE",
    MARKDOWN_PARAGRAPH = "MARKDOWN_PARAGRAPH",
    MARKDOWN_IMAGE = "MARKDOWN_IMAGE",
    MARKDOWN_CHAPTER = "MARKDOWN_CHAPTER",
    MARKDOWN_LIST = "MARKDOWN_LIST",
    CHOICE = "CHOICE",
    PLUCKED_FIELD = "PLUCKED_FIELD",
    OPEN = "OPEN"
}
export interface IError {
    message: string;
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
}
export {};
