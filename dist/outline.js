"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const helpers_1 = require("./helpers");
const BaseCstVisitorWithDefaults = parser_1.parser.getBaseCstVisitorConstructorWithDefaults();
class OutlineVisitor extends BaseCstVisitorWithDefaults {
    constructor() {
        super();
        this.tags = {};
        this.validateVisitor();
    }
    START(ctx) {
        const expressions = helpers_1.purge(ctx.EXPRESSION.map(expression => this.visit(expression)));
        return expressions;
    }
    EXPRESSION(ctx) {
        const annotations = helpers_1.purge(ctx.ROOT_ANNOTATIONS.map(a => this.visit(a)));
        if (ctx.TYPE) {
            return Object.assign({ annotations }, this.visit(ctx.TYPE[0]));
        }
        else if (ctx.DATA) {
            return Object.assign({ annotations }, this.visit(ctx.DATA[0]));
        }
        else if (ctx.ALIAS) {
            return Object.assign({ annotations }, this.visit(ctx.ALIAS[0]));
        }
        else if (ctx.CommentBlock) {
            return {
                type: NodeType.COMMENT,
                comment: ctx.CommentBlock[0].image
            };
        }
        else if (ctx.MARKDOWN_CHAPTER) {
            return this.visit(ctx.MARKDOWN_CHAPTER[0]);
        }
        else if (ctx.MARKDOWN_IMAGE) {
            return this.visit(ctx.MARKDOWN_IMAGE[0]);
        }
        else if (ctx.MARKDOWN_PARAGRAPH) {
            return this.visit(ctx.MARKDOWN_PARAGRAPH[0]);
        }
        else if (ctx.MARKDOWN_CODE) {
            return this.visit(ctx.MARKDOWN_CODE[0]);
        }
        else if (ctx.MARKDOWN_LIST) {
            return this.visit(ctx.MARKDOWN_LIST);
        }
        else {
            console.log(ctx);
            return null;
        }
    }
    TYPE(ctx) {
        return Object.assign({ type: NodeType.TYPE }, this.visit(ctx.IDENTIFIER[0]), { extends: (ctx.Identifier || []).map(i => i.image), extends_start: (ctx.Identifier || []).map(helpers_1.getStartToken), fields: ctx.SIGN_EqualsType ? ctx.TYPE_FIELD.map(f => this.visit(f)) : [] });
    }
    TYPE_FIELD(ctx) {
        return Object.assign({ type: NodeType.TYPE_FIELD }, this.visit(ctx.IDENTIFIER[0]), this.visit(ctx.TYPE_IDENTIFIER[0]), { restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r)), annotations: helpers_1.purge((ctx.ANNOTATIONS || []).map(a => this.visit(a))) });
    }
    DATA(ctx) {
        const options = ctx.DATA_OPTION.map(d => this.visit(d));
        return Object.assign({ type: NodeType.DATA }, this.visit(ctx.IDENTIFIER[0]), { options });
    }
    DATA_OPTION(ctx) {
        return Object.assign({ type: NodeType.DATA_OPTION }, this.visit(ctx.IDENTIFIER[0]));
    }
    ALIAS(ctx) {
        return Object.assign({ type: NodeType.ALIAS }, this.visit(ctx.IDENTIFIER[0]), this.visit(ctx.TYPE_IDENTIFIER[0]), { restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r)) });
    }
    IDENTIFIER(ctx) {
        if (ctx.GenericIdentifier) {
            return {
                id: ctx.GenericIdentifier[0].image,
                params: (ctx.GenericParameter || []).map(g => g.image),
                id_start: helpers_1.getStartToken(ctx.GenericIdentifier[0]),
                params_start: (ctx.GenericParameter || []).map(helpers_1.getStartToken)
            };
        }
        else if (ctx.FieldName) {
            return {
                id: ctx.FieldName[0].image,
                id_start: helpers_1.getStartToken(ctx.FieldName[0])
            };
        }
        else {
            return {
                id: ctx.Identifier[0].image,
                id_start: helpers_1.getStartToken(ctx.Identifier[0])
            };
        }
    }
    TYPE_IDENTIFIER(ctx) {
        if (ctx.GenericIdentifier) {
            return {
                ofType: ctx.GenericIdentifier[0].image,
                ofType_params: (ctx.GenericParameter || []).map(g => g.image),
                ofType_start: helpers_1.getStartToken(ctx.GenericIdentifier[0]),
                ofType_params_start: (ctx.GenericParameter || []).map(helpers_1.getStartToken)
            };
        }
        else if (ctx.GenericParameter) {
            return {
                ofType: ctx.GenericParameter[0].image,
                ofType_start: helpers_1.getStartToken(ctx.GenericParameter[0]),
                ofType_params: [],
                ofType_params_start: []
            };
        }
        else {
            let [ofType, ...ofType_params] = ctx.Identifier.map(i => i.image);
            let [ofType_start, ...ofType_params_start] = ctx.Identifier.map(helpers_1.getStartToken);
            return {
                ofType,
                ofType_start,
                ofType_params,
                ofType_params_start
            };
        }
    }
    RESTRICTION(ctx) {
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
    MARKDOWN_CHAPTER(ctx) {
        return {
            type: NodeType.MARKDOWN_CHAPTER,
            content: ctx.MarkdownChapterLiteral[0].image
        };
    }
    MARKDOWN_IMAGE(ctx) {
        const pattern = /(\[)(.*)(\])(\()(.*)(\))/;
        const segments = pattern.exec(ctx.MarkdownImageLiteral[0].image) || [];
        return {
            type: NodeType.MARKDOWN_IMAGE,
            content: ctx.MarkdownImageLiteral[0].image,
            alt: segments[2],
            uri: segments[5]
        };
    }
    MARKDOWN_PARAGRAPH(ctx) {
        return {
            type: NodeType.MARKDOWN_PARAGRAPH,
            content: ctx.MarkdownParagraphLiteral[0].image
        };
    }
    MARKDOWN_CODE(ctx) {
        const pattern = /(`{3})(\w*(?=\n))?([^`]*)(`{3})/;
        const segments = pattern.exec(ctx.MarkdownCodeLiteral[0].image) || [];
        return {
            type: NodeType.MARKDOWN_CODE,
            content: ctx.MarkdownCodeLiteral[0].image,
            lang: segments[2],
            source: (segments[3] || "").trim()
        };
    }
    MARKDOWN_LIST(ctx) {
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
    ROOT_ANNOTATIONS(ctx) {
        // The description is the accumulation of all the annotations
        // without a real key.
        const description = (ctx.Annotation || [])
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
        return [descriptionAnnotation, ...(ctx.Annotation || []).map(this.ANNOTATION)];
    }
    ANNOTATIONS(ctx) {
        return this.ROOT_ANNOTATIONS(ctx);
    }
    ANNOTATION(ctx) {
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
exports.OutlineVisitor = OutlineVisitor;
var NodeType;
(function (NodeType) {
    NodeType["TYPE"] = "TYPE";
    NodeType["TYPE_FIELD"] = "TYPE_FIELD";
    NodeType["ANNOTATION"] = "ANNOTATION";
    NodeType["DATA"] = "DATA";
    NodeType["DATA_OPTION"] = "DATA_OPTION";
    NodeType["ALIAS"] = "ALIAS";
    NodeType["COMMENT"] = "COMMENT";
    NodeType["CHAPTER"] = "CHAPTER";
    NodeType["IMAGE"] = "IMAGE";
    NodeType["PARAGRAPH"] = "PARAGRAPH";
    NodeType["MARKDOWN_CODE"] = "MARKDOWN_CODE";
    NodeType["MARKDOWN_PARAGRAPH"] = "MARKDOWN_PARAGRAPH";
    NodeType["MARKDOWN_IMAGE"] = "MARKDOWN_IMAGE";
    NodeType["MARKDOWN_CHAPTER"] = "MARKDOWN_CHAPTER";
    NodeType["MARKDOWN_LIST"] = "MARKDOWN_LIST";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
const defaultStart = {
    startLineNumber: 0,
    endLineNumber: 0,
    startColumn: 0,
    endColumn: 0
};
//# sourceMappingURL=outline.js.map