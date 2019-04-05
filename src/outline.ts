import { parser } from "./parser";
import { purge, getStartToken, ITokenStart } from "./helpers";

const BaseCstVisitorWithDefaults: any = parser.getBaseCstVisitorConstructorWithDefaults();

export class OutlineVisitor extends BaseCstVisitorWithDefaults {
    modules: any = {};

    constructor(modules?: any) {
        super();
        this.validateVisitor();
        this.modules = modules;
    }

    START(ctx: any): IExpression[] {
        const expressions = purge<IExpression>(
            (ctx.EXPRESSION || []).map(expression => this.visit(expression))
        );

        return expressions;
    }

    EXPRESSION(ctx: any): IExpression | null {
        const annotations = purge(ctx.ROOT_ANNOTATIONS.map(a => this.visit(a)));
        const ignoreAttribute: any = annotations.find((a: IAnnotation) => a.key === "ignore");
        const ignore = ignoreAttribute ? ignoreAttribute.value === "true" : false;

        if (ctx.TYPE) {
            return {
                annotations,
                ...this.visit(ctx.TYPE[0]),
                ignore
            };
        } else if (ctx.DATA) {
            return {
                annotations,
                ...this.visit(ctx.DATA[0]),
                ignore
            };
        } else if (ctx.ALIAS) {
            return {
                annotations,
                ...this.visit(ctx.ALIAS[0])
            };
        } else if (ctx.VIEW) {
            return {
                annotations,
                ...this.visit(ctx.VIEW[0])
            };
        } else if (ctx.OPEN) {
            return this.visit(ctx.OPEN[0]);
        } else if (ctx.CHOICE) {
            return {
                annotations,
                ...this.visit(ctx.CHOICE[0])
            };
        } else if (ctx.CommentBlock) {
            return {
                type: NodeType.COMMENT,
                comment: ctx.CommentBlock[0].image
            };
        } else if (ctx.MARKDOWN_CHAPTER) {
            return this.visit(ctx.MARKDOWN_CHAPTER[0]);
        } else if (ctx.MARKDOWN_IMAGE) {
            return this.visit(ctx.MARKDOWN_IMAGE[0]);
        } else if (ctx.MARKDOWN_PARAGRAPH) {
            return this.visit(ctx.MARKDOWN_PARAGRAPH[0]);
        } else if (ctx.MARKDOWN_CODE) {
            return this.visit(ctx.MARKDOWN_CODE[0]);
        } else if (ctx.MARKDOWN_LIST) {
            return this.visit(ctx.MARKDOWN_LIST);
        } else if (ctx.ROOT_ANNOTATIONS) {
            // do nothing, already parsed at the top...
            return null;
        } else {
            console.log(ctx);
            return null;
        }
    }

    OPEN(ctx: any): IOpen {
        return {
            type: NodeType.OPEN,
            module: ctx.Identifier.map(i => i.image).join("."),
            imports: this.visit(ctx.IMPORTING[0])
        };
    }

    IMPORTING(ctx: any): string[] {
        return ctx.Identifier.map(i => i.image);
    }

    TYPE(ctx: any): IType {
        return {
            type: NodeType.TYPE,
            ...this.visit(ctx.IDENTIFIER[0]),
            extends: (ctx.Identifier || []).map(i => i.image),
            extends_start: (ctx.Identifier || []).map(getStartToken),
            fields: ctx.SIGN_EqualsType ? ctx.TYPE_FIELD.map(f => this.visit(f)) : []
        };
    }

    TYPE_FIELD(ctx: any): ITypeField | IPluckedField {
        if (ctx.KW_pluck) {
            return {
                type: NodeType.PLUCKED_FIELD,
                parts: ctx.Identifier.map(i => i.image),
                parts_start: ctx.Identifier.map(getStartToken)
            };
        } else {
            return {
                type: NodeType.TYPE_FIELD,
                ...this.visit(ctx.IDENTIFIER[0]),
                ...this.visit(ctx.TYPE_IDENTIFIER[0]),
                restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r)),
                annotations: purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
            };
        }
    }

    DATA(ctx: any): IData {
        const options = ctx.DATA_OPTION.map(d => this.visit(d));
        return {
            type: NodeType.DATA,
            ...this.visit(ctx.IDENTIFIER[0]),
            options
        };
    }

    DATA_OPTION(ctx: any): IDataOption {
        return {
            type: NodeType.DATA_OPTION,
            ...this.visit(ctx.IDENTIFIER[0])
        };
    }

    ALIAS(ctx: any): IAlias {
        return {
            type: NodeType.ALIAS,
            ...this.visit(ctx.IDENTIFIER[0]),
            ...this.visit(ctx.TYPE_IDENTIFIER[0]),
            restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r))
        };
    }

    VIEW(ctx: any): IView {
        // Parse the Directives in the code.
        const pattern = /( *)(%)(.*)(:)(.*)(\n)/;
        let directives: IDirective[] = (ctx.DirectiveLiteral || []).map(d => {
            const segments = pattern.exec(d.image);
            if (segments) {
                return {
                    key: segments[3].trim(),
                    value: segments[5].trim()
                };
            } else {
                return {
                    key: "description",
                    value: d.image
                        .replace(/%%/g, "")
                        .split(/\n +/)
                        .join(" ")
                        .trim()
                };
            }
        });

        return {
            type: NodeType.VIEW,
            id: ctx.ViewIdentifier ? ctx.ViewIdentifier[0].image : "",
            nodes: (ctx.Identifier || []).map(i => i.image),
            directives
        };
    }

    CHOICE(ctx: any): IChoice {
        return {
            type: NodeType.CHOICE,
            id: ctx.Identifier[0].image,
            id_start: getStartToken(ctx.Identifier[0]),
            options: ctx.CHOICE_OPTION.map(o => this.visit(o)),
            options_start: ctx.CHOICE_OPTION.map(o => {
                const literal = o.children.StringLiteral || o.children.NumberLiteral;
                return getStartToken(literal[0]);
            })
        };
    }

    CHOICE_OPTION(ctx: any) {
        return ctx.StringLiteral
            ? ctx.StringLiteral[0].image.replace(/"/g, "")
            : ctx.NumberLiteral
            ? +ctx.NumberLiteral[0].image
            : "";
    }

    IDENTIFIER(ctx: any): IIdentity {
        if (ctx.GenericIdentifier) {
            return {
                id: ctx.GenericIdentifier[0].image,
                params: (ctx.GenericParameter || []).map(g => g.image),
                id_start: getStartToken(ctx.GenericIdentifier[0]),
                params_start: (ctx.GenericParameter || []).map(getStartToken)
            };
        } else if (ctx.FieldName) {
            return {
                id: ctx.FieldName[0].image,
                id_start: getStartToken(ctx.FieldName[0])
            };
        } else {
            return {
                id: ctx.Identifier[0].image,
                id_start: getStartToken(ctx.Identifier[0])
            };
        }
    }

    TYPE_IDENTIFIER(ctx: any) {
        if (ctx.GenericIdentifier) {
            return {
                ofType: ctx.GenericIdentifier[0].image,
                ofType_params: (ctx.GenericParameter || []).map(g => g.image),
                ofType_start: getStartToken(ctx.GenericIdentifier[0]),
                ofType_params_start: (ctx.GenericParameter || []).map(getStartToken)
            };
        } else if (ctx.GenericParameter) {
            return {
                ofType: ctx.GenericParameter[0].image,
                ofType_start: getStartToken(ctx.GenericParameter[0]),
                ofType_params: [],
                ofType_params_start: []
            };
        } else {
            let [ofType, ...ofType_params] = ctx.Identifier.map(i => i.image);
            let [ofType_start, ...ofType_params_start] = ctx.Identifier.map(getStartToken);
            return {
                ofType,
                ofType_start,
                ofType_params,
                ofType_params_start
            };
        }
    }

    RESTRICTION(ctx): IRestriction {
        return {
            key: ctx.RestrictionIdentifier[0].image,
            value: ctx.NumberLiteral
                ? +ctx.NumberLiteral[0].image
                : ctx.StringLiteral
                ? ctx.StringLiteral[0].image
                : ctx.PatternLiteral
                ? ctx.PatternLiteral[0].image
                : ctx.BooleanLiteral
                ? ctx.BooleanLiteral[0].image === "True"
                : false
        };
    }

    // GetIdentity(ctx: any): IIdentity {

    // }

    /* MARKDOWN */

    MARKDOWN_CHAPTER(ctx: any): IMarkdownChapter {
        const content: string = ctx.MarkdownChapterLiteral[0].image;
        const depth = content.startsWith("#####")
            ? 5
            : content.startsWith("####")
            ? 4
            : content.startsWith("###")
            ? 3
            : content.startsWith("##")
            ? 2
            : content.startsWith("#")
            ? 1
            : 1;
        return {
            type: NodeType.MARKDOWN_CHAPTER,
            content: content.replace(/#+/, ""),
            depth
        };
    }

    MARKDOWN_IMAGE(ctx: any): IMarkdownImage {
        const pattern = /(\[)(.*)(\])(\()(.*)(\))/;
        const segments = pattern.exec(ctx.MarkdownImageLiteral[0].image) || [];

        return {
            type: NodeType.MARKDOWN_IMAGE,
            content: ctx.MarkdownImageLiteral[0].image,
            alt: segments[2],
            uri: segments[5]
        };
    }

    MARKDOWN_PARAGRAPH(ctx: any): IMarkdownParagraph {
        return {
            type: NodeType.MARKDOWN_PARAGRAPH,
            content: ctx.MarkdownParagraphLiteral[0].image
        };
    }

    MARKDOWN_CODE(ctx: any): IMarkdownCode {
        const pattern = /(`{3})(\w*(?=\n))?([^`]*)(`{3})/;
        const segments = pattern.exec(ctx.MarkdownCodeLiteral[0].image) || [];

        return {
            type: NodeType.MARKDOWN_CODE,
            content: ctx.MarkdownCodeLiteral[0].image,
            lang: segments[2],
            source: (segments[3] || "").trim()
        };
    }

    MARKDOWN_LIST(ctx: any): IMarkdownList | null {
        const items = ctx.MarkdownListLiteral[0].image
            .split(/\n */)
            .map(s => s.replace(/\*/, "").trim())
            .filter(f => f);
        return {
            type: NodeType.MARKDOWN_LIST,
            items
        };
    }

    /* ANNOTATIONS */

    ROOT_ANNOTATIONS(ctx: any): IAnnotation[] {
        // The description is the accumulation of all the annotations
        // without a real key.
        const description = (ctx.AnnotationLiteral || [])
            .filter(a => a.image.indexOf(":") === -1)
            .map(a => {
                const pattern = /( *)(@)(.*)/;
                const result = pattern.exec(a.image) || [];
                return (result[3] || "").trim();
            })
            .join(" ");

        // Create the description annotation.
        const descriptionAnnotation = description
            ? {
                  type: NodeType.ANNOTATION,
                  key: "description",
                  value: description
              }
            : null;

        // return the collection of annotations with the description annotation
        return [descriptionAnnotation, ...(ctx.AnnotationLiteral || []).map(this.ANNOTATION)];
    }

    ANNOTATIONS(ctx: any) {
        return this.ROOT_ANNOTATIONS(ctx);
    }

    ANNOTATION(ctx: any): IAnnotation | null {
        const pattern = /( *)(@)(.*)(:)(.*)/;
        const result = pattern.exec(ctx.image);
        return result
            ? {
                  type: NodeType.ANNOTATION,
                  key: result[3].trim(),
                  value: result[5].trim()
              }
            : null;
    }
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

export type IExpression =
    | IType
    | IAlias
    | IData
    | IComment
    | IMarkdownChapter
    | IMarkdownCode
    | IMarkdownImage
    | IMarkdownList
    | IMarkdownParagraph;

export enum NodeType {
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

const defaultStart: ITokenStart = {
    startLineNumber: 0,
    endLineNumber: 0,
    startColumn: 0,
    endColumn: 0
};

export interface IError {
    message: string;
    startLineNumber: number;
    endLineNumber: number;
    startColumn: number;
    endColumn: number;
}
