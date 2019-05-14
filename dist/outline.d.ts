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
    GUIDELINE(ctx: any): IGuideline;
    MARKDOWN(ctx: any): IMarkdown | null;
    FLOW(ctx: any): IFlow;
    OPERATION(ctx: any): IOperation | IFireAndForget | IFlowFunction | IPubSub;
    FLOW_FUNCTION(ctx: any): IFlowFunction;
    /**
     * A SYSTEM FLOW looks something like:
     *
     * @ id: getCustomer
     * ("Entity Service", SAP) :: String -> Customer
     */
    FLOW_SYSTEM(ctx: any): IOperation | IFireAndForget;
    /**
     * Be able to publish to some queue
     *
     * "Customer Service" pub "The Event Name" :: Customer
     */
    FLOW_PUB(ctx: any): IPubSub;
    /**
     * Be able to subscribe to some queue
     *
     * "Customer Service" sub "The Event Name" :: String
     */
    FLOW_SUB(ctx: any): IPubSub;
    ID_OR_STRING(ctx: any): string;
    OPERATION_PARAMETER(ctx: any): IOperationParameter;
    OPERATION_PARAMETER_TYPE(ctx: any): any;
    OPERATION_PARAMETER_FIELD_TYPE(ctx: any): any;
    CHOICE(ctx: any): IChoice;
    CHOICE_OPTION(ctx: any): IChoiceOption;
    MAP(ctx: any): IMap;
    MAP_FLOW(ctx: any): IMapFlow;
    MAP_FLOW_KEY(ctx: any): string | null;
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
    aggregate?: string;
    plantUML?: {
        id: string;
    };
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
export interface IGuideline {
    type: NodeType;
    markdown: IMarkdown[];
    directives: IDirective[];
    title?: string;
    version?: string;
    subject?: string;
}
export interface IFlow {
    type: NodeType;
    directives: IDirective[];
    operations: (IOperation | IFireAndForget | IFlowFunction | IPubSub)[];
}
export interface IOperation {
    type: NodeType;
    id?: string;
    id_start?: ITokenStart;
    result: string;
    result_ofType: string;
    result_start: ITokenStart;
    result_params: string[];
    result_params_start: ITokenStart[];
    from: string;
    to: string;
    description: string;
    params: IOperationParameter[];
    annotations: IAnnotation[];
}
export interface IFlowFunction {
    type: NodeType;
    id: string;
    id_start: ITokenStart;
    ofType: string;
    ofType_ofType: string;
    ofType_start: ITokenStart;
    ofType_params: string[];
    ofType_params_start: ITokenStart[];
    description: string;
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
export interface IFireAndForget {
    type: NodeType;
    id: string;
    id_start: ITokenStart;
    from: string;
    to: string;
    description: string;
    params: IOperationParameter[];
    annotations: IAnnotation[];
}
export interface IData {
    type: NodeType;
    id: string;
    params?: string[];
    options: IDataOption[];
    annotations: IAnnotation[];
    ignore: boolean;
    aggregate?: string;
    plantUML?: {
        id: string;
    };
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
    annotations: IAnnotation[];
}
export interface IMap {
    type: NodeType;
    directives: IDirective[];
    flows: IMapFlow[];
}
export interface IMapFlow {
    type: NodeType;
    nodes: string[];
}
export interface IAggregate {
    type: NodeType;
    root: string;
    root_start: ITokenStart;
    valueObjects: string[];
    valueObjects_start: ITokenStart[];
    directives: IDirective[];
    annotations: IAnnotation[];
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
    aggregate?: string;
    plantUML?: {
        id: string;
    };
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
    options: IChoiceOption[];
    options_start: ITokenStart[];
    annotations: IAnnotation[];
    aggregate?: string;
    plantUML?: {
        id: string;
    };
}
export interface IPubSub {
    type: string;
    service: string;
    event: string;
    message: IOperationParameter[];
    annotations: IAnnotation[];
}
export interface IChoiceOption {
    type: string;
    id: string | number;
    annotations: IAnnotation[];
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
export declare type IMarkdown = IMarkdownChapter | IMarkdownCode | IMarkdownImage | IMarkdownList | IMarkdownCode;
export declare type IExpression = IType | IAlias | IData | IComment | IAggregate | IChoice | IFlow | IView | IMap | IGuideline | IMarkdownChapter | IMarkdownCode | IMarkdownImage | IMarkdownList | IMarkdownParagraph;
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
    OPERATION_PARAMETER = "OPERATION_PARAMETER",
    MAP = "MAP",
    MAP_FLOW = "MAP_FLOW",
    PUB = "PUB",
    SUB = "SUB",
    FIRE_FORGET = "FIRE_FORGET",
    FLOW_FUNCTION = "FLOW_FUNCTION",
    GUIDELINE = "GUIDELINE"
}
export interface IError {
    message: string | object;
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
    ruleStack?: string[];
}
export {};
