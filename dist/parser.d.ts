import { Parser } from "chevrotain";
declare class DomainParser extends Parser {
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
export declare const parser: DomainParser;
export {};
