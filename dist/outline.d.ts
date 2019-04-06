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
    AGGREGATE(ctx: any): IAggregate;
    FLOW(ctx: any): IFlow;
    OPERATION(ctx: any): IOperation;
    OPERATION_PARAMETER(ctx: any): IOperationParameter;
    OPERATION_PARAMETER_TYPE(ctx: any): any;
    OPERATION_PARAMETER_FIELD_TYPE(ctx: any): any;
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
    ignore: boolean;
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
export interface IFlow {
    type: NodeType;
    directives: IDirective[];
    operations: IOperation[];
}
export interface IOperation {
    type: NodeType;
    id: string;
    id_start: ITokenStart;
    result: string;
    result_start: ITokenStart;
    params: IOperationParameter[];
    annotations: IAnnotation[];
}
export interface IOperationParameter {
    type: NodeType;
    id?: string;
    id_start?: ITokenStart;
    ofType: string;
    ofType_start: ITokenStart;
    ofType_params: string[];
    ofType_params_start: ITokenStart[];
}
export interface IData {
    type: NodeType;
    id: string;
    params?: string[];
    options: IDataOption[];
    annotations: IAnnotation[];
    ignore: boolean;
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
    nodes_start: ITokenStart[];
    directives: IDirective[];
}
export interface IAggregate {
    type: NodeType;
    root: string;
    root_start: ITokenStart;
    valueObjects: string[];
    valueObjects_start: ITokenStart[];
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
    restrictions: IRestriction[];
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
export declare type IExpression = IType | IAlias | IData | IComment | IAggregate | IFlow | IView | IMarkdownChapter | IMarkdownCode | IMarkdownImage | IMarkdownList | IMarkdownParagraph;
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
    AGGREGATE = "AGGREGATE",
    PARAGRAPH = "PARAGRAPH",
    MARKDOWN_CODE = "MARKDOWN_CODE",
    MARKDOWN_PARAGRAPH = "MARKDOWN_PARAGRAPH",
    MARKDOWN_IMAGE = "MARKDOWN_IMAGE",
    MARKDOWN_CHAPTER = "MARKDOWN_CHAPTER",
    MARKDOWN_LIST = "MARKDOWN_LIST",
    CHOICE = "CHOICE",
    PLUCKED_FIELD = "PLUCKED_FIELD",
    OPEN = "OPEN",
    FLOW = "FLOW",
    OPERATION = "OPERATION",
    OPERATION_PARAMETER = "OPERATION_PARAMETER"
}
export interface IError {
    message: string;
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
}
export {};
