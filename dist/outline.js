"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser_1 = require("./parser");
const helpers_1 = require("./helpers");
const path_1 = require("path");
const BaseCstVisitorWithDefaults = parser_1.parser.getBaseCstVisitorConstructorWithDefaults();
class OutlineVisitor extends BaseCstVisitorWithDefaults {
    constructor(modules) {
        super();
        this.modules = {};
        this.validateVisitor();
        this.modules = modules;
    }
    START(ctx) {
        const expressions = helpers_1.purge((ctx.EXPRESSION || []).map(expression => this.visit(expression)));
        return expressions;
    }
    EXPRESSION(ctx) {
        const annotations = helpers_1.purge(ctx.ANNOTATIONS.map(a => this.visit(a)));
        const ignoreAnnotation = annotations.find((a) => a.key === "ignore");
        const ignore = ignoreAnnotation ? ignoreAnnotation.value === "true" : false;
        const aggregateAnnotation = annotations.find(a => a.key === "aggregate");
        const aggregate = aggregateAnnotation ? aggregateAnnotation.value : null;
        let result;
        if (ctx.TYPE) {
            result = Object.assign({ annotations,
                aggregate }, this.visit(ctx.TYPE[0]), { ignore });
        }
        else if (ctx.DATA) {
            result = Object.assign({ annotations,
                aggregate }, this.visit(ctx.DATA[0]), { ignore });
        }
        else if (ctx.ALIAS) {
            result = Object.assign({ annotations,
                aggregate }, this.visit(ctx.ALIAS[0]), { ignore });
        }
        else if (ctx.VIEW) {
            return Object.assign({ annotations }, this.visit(ctx.VIEW[0]), { ignore });
        }
        else if (ctx.OPEN) {
            return this.visit(ctx.OPEN[0]);
        }
        else if (ctx.CHOICE) {
            result = Object.assign({ annotations,
                aggregate }, this.visit(ctx.CHOICE[0]), { ignore });
        }
        else if (ctx.CommentBlock) {
            return {
                type: NodeType.COMMENT,
                comment: ctx.CommentBlock[0].image
            };
        }
        else if (ctx.AGGREGATE) {
            return Object.assign({ annotations }, this.visit(ctx.AGGREGATE[0]), { ignore });
        }
        else if (ctx.FLOW) {
            return Object.assign({ annotations }, this.visit(ctx.FLOW[0]), { ignore });
        }
        else if (ctx.MAP) {
            return Object.assign({ annotations }, this.visit(ctx.MAP[0]), { ignore });
        }
        else if (ctx.GUIDELINE) {
            return Object.assign({ annotations }, this.visit(ctx.GUIDELINE[0]));
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
        else if (ctx.EndBlock) {
            // do nothing, already parsed at the top...
            return null;
        }
        else {
            console.log(ctx);
            return null;
        }
        result.plantUML = {
            id: result.aggregate ? `${result.aggregate}.${result.id}` : result.id
        };
        return result;
    }
    OPEN(ctx) {
        return {
            type: NodeType.OPEN,
            module: ctx.Identifier.map(i => i.image).join("."),
            imports: this.visit(ctx.IMPORTING[0])
        };
    }
    IMPORTING(ctx) {
        return ctx.Identifier.map(i => i.image);
    }
    TYPE(ctx) {
        return Object.assign({ type: NodeType.TYPE }, this.visit(ctx.IDENTIFIER[0]), { extends: (ctx.Identifier || []).map(i => i.image), extends_start: (ctx.Identifier || []).map(helpers_1.getStartToken), fields: ctx.SIGN_EqualsType ? ctx.TYPE_FIELD.map(f => this.visit(f)) : [] });
    }
    TYPE_FIELD(ctx) {
        if (ctx.KW_pluck) {
            return {
                type: NodeType.PLUCKED_FIELD,
                parts: ctx.Identifier.map(i => i.image),
                parts_start: ctx.Identifier.map(helpers_1.getStartToken),
                annotations: helpers_1.purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
            };
        }
        else {
            return Object.assign({ type: NodeType.TYPE_FIELD }, this.visit(ctx.IDENTIFIER[0]), this.visit(ctx.TYPE_IDENTIFIER[0]), { restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r)), annotations: helpers_1.purge((ctx.ANNOTATIONS || []).map(a => this.visit(a))) });
        }
    }
    DATA(ctx) {
        const options = ctx.DATA_OPTION.map(d => this.visit(d));
        return Object.assign({ type: NodeType.DATA }, this.visit(ctx.IDENTIFIER[0]), { options });
    }
    DATA_OPTION(ctx) {
        return Object.assign({ type: NodeType.DATA_OPTION }, this.visit(ctx.IDENTIFIER[0]), { annotations: helpers_1.purge((ctx.ANNOTATIONS || []).map(a => this.visit(a))) });
    }
    ALIAS(ctx) {
        return Object.assign({ type: NodeType.ALIAS }, this.visit(ctx.IDENTIFIER[0]), this.visit(ctx.TYPE_IDENTIFIER[0]), { restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r)) });
    }
    VIEW(ctx) {
        return {
            type: NodeType.VIEW,
            id: ctx.ViewIdentifier ? ctx.ViewIdentifier[0].image : "",
            nodes: (ctx.Identifier || []).map(i => i.image),
            nodes_start: (ctx.Identifier || []).map(i => helpers_1.getStartToken(i)),
            directives: parseDirectives(ctx),
            annotations: []
        };
    }
    AGGREGATE(ctx) {
        return {
            type: NodeType.AGGREGATE,
            root: ctx.ViewIdentifier ? ctx.ViewIdentifier[0].image : "",
            root_start: helpers_1.getStartToken(ctx.ViewIdentifier[0]),
            valueObjects: (ctx.Identifier || []).map(i => i.image),
            valueObjects_start: (ctx.Identifier || []).map(i => helpers_1.getStartToken(i)),
            directives: parseDirectives(ctx),
            operations: (ctx.OPERATION || []).map(o => this.visit(o)),
            annotations: []
        };
    }
    GUIDELINE(ctx) {
        const directives = parseDirectives(ctx);
        const markdown = ctx.MARKDOWN.map(m => this.visit(m));
        let result = {
            type: NodeType.GUIDELINE,
            markdown,
            directives
        };
        directives.map(d => (result[d.key] = d.value));
        return result;
    }
    MARKDOWN(ctx) {
        if (ctx.MARKDOWN_CHAPTER) {
            return this.visit(ctx.MARKDOWN_CHAPTER[0]);
        }
        else if (ctx.MARKDOWN_PARAGRAPH) {
            return this.visit(ctx.MARKDOWN_PARAGRAPH[0]);
        }
        else if (ctx.MARKDOWN_IMAGE) {
            return this.visit(ctx.MARKDOWN_IMAGE[0]);
        }
        else if (ctx.MARKDOWN_CODE) {
            return this.visit(ctx.MARKDOWN_CODE[0]);
        }
        else if (ctx.MARKDOWN_LIST) {
            return this.visit(ctx.MARKDOWN_LIST[0]);
        }
        else {
            return null;
        }
    }
    FLOW(ctx) {
        return {
            type: NodeType.FLOW,
            operations: helpers_1.purge((ctx.OPERATION || []).map(o => this.visit(o))),
            directives: parseDirectives(ctx)
        };
    }
    OPERATION(ctx) {
        let annotations = helpers_1.purge(this.ROOT_ANNOTATIONS(ctx));
        let r = {};
        if (ctx.FLOW_FUNCTION) {
            r = this.visit(ctx.FLOW_FUNCTION[0]);
        }
        else if (ctx.FLOW_PUB) {
            r = this.visit(ctx.FLOW_PUB[0]);
        }
        else if (ctx.FLOW_SUB) {
            r = this.visit(ctx.FLOW_SUB[0]);
        }
        else if (ctx.FLOW_SYSTEM) {
            r = this.visit(ctx.FLOW_SYSTEM[0]);
        }
        r.annotations = annotations;
        annotations.forEach(a => {
            r[a.key] = r[a.key] || a.value;
        });
        // it can be typed a "FLOW_FUNCTION" but actually be an operation,
        // we will rectify this...
        if (r.type === NodeType.FLOW_FUNCTION && r.to && r.from) {
            r.type = NodeType.OPERATION;
            r.result = r.ofType;
            r.result_start = r.ofType_start;
            r.result_params = r.ofType_params;
            r.result_params_start = r.ofType_params_start;
            delete r.ofType;
            delete r.ofType_params;
            delete r.ofType_start;
            delete r.ofType_params_start;
        }
        return r;
    }
    FLOW_FUNCTION(ctx) {
        let params = (ctx.OPERATION_PARAMETER || []).map(p => this.visit(p));
        return Object.assign({}, params[params.length - 1], { type: NodeType.FLOW_FUNCTION, id: ctx.GenericParameter[0].image, id_start: helpers_1.getStartToken(ctx.GenericParameter[0]), params: params.slice(0, params.length - 1) });
    }
    /**
     * A SYSTEM FLOW looks something like:
     *
     * @ id: getCustomer
     * ("Entity Service", SAP) :: String -> Customer
     */
    FLOW_SYSTEM(ctx) {
        let fireAndForget = !!ctx.SIGN_fireAndForget;
        let from = this.visit(ctx.ID_OR_STRING[0]);
        let to = this.visit(ctx.ID_OR_STRING[1]);
        let params = helpers_1.purge((ctx.OPERATION_PARAMETER || []).map(p => this.visit(p)));
        let result = params[params.length - 1];
        if (fireAndForget) {
            return {
                type: NodeType.FIRE_FORGET,
                from,
                to,
                params
            };
        }
        else {
            return {
                type: NodeType.OPERATION,
                from: from,
                to: to,
                params: params.slice(0, params.length - 1),
                result: result.id || result.ofType,
                result_start: result.id_start || result.ofType_start,
                result_params: result.ofType_params,
                result_params_start: result.ofType_params_start,
                result_ofType: result.ofType,
                description: "",
                annotations: []
            };
        }
    }
    /**
     * Be able to publish to some queue
     *
     * "Customer Service" pub "The Event Name" :: Customer
     */
    FLOW_PUB(ctx) {
        let params = helpers_1.purge((ctx.OPERATION_PARAMETER || []).map(p => this.visit(p)));
        return {
            type: NodeType.PUB,
            service: this.visit(ctx.ID_OR_STRING[0]),
            event: this.visit(ctx.ID_OR_STRING[1]),
            message: params,
            annotations: []
        };
    }
    /**
     * Be able to subscribe to some queue
     *
     * "Customer Service" sub "The Event Name" :: String
     */
    FLOW_SUB(ctx) {
        let params = helpers_1.purge((ctx.OPERATION_PARAMETER || []).map(p => this.visit(p)));
        return {
            type: NodeType.SUB,
            service: this.visit(ctx.ID_OR_STRING[0]),
            event: this.visit(ctx.ID_OR_STRING[1]),
            message: params,
            annotations: []
        };
    }
    ID_OR_STRING(ctx) {
        if (ctx.Identifier) {
            return ctx.Identifier[0].image;
        }
        else if (ctx.GenericIdentifier) {
            return ctx.GenericIdentifier[0].image;
        }
        else {
            return ctx.StringLiteral[0].image.replace(/"/g, "");
        }
    }
    OPERATION_PARAMETER(ctx) {
        let paramDetails;
        if (ctx.OPERATION_PARAMETER_FIELD_TYPE) {
            paramDetails = this.visit(ctx.OPERATION_PARAMETER_FIELD_TYPE[0]);
        }
        else if (ctx.OPERATION_PARAMETER_TYPE) {
            paramDetails = this.visit(ctx.OPERATION_PARAMETER_TYPE[0]);
        }
        return Object.assign({ type: NodeType.OPERATION_PARAMETER }, paramDetails);
    }
    OPERATION_PARAMETER_TYPE(ctx) {
        let t = this.visit(ctx.TYPE_IDENTIFIER[0]);
        return Object.assign({ id: t.ofType, id_start: t.ofType_start }, t);
    }
    OPERATION_PARAMETER_FIELD_TYPE(ctx) {
        return Object.assign({ id: ctx.GenericParameter[0].image, id_start: helpers_1.getStartToken(ctx.GenericParameter[0]) }, this.visit(ctx.TYPE_IDENTIFIER[0]));
    }
    CHOICE(ctx) {
        let type = this.visit(ctx.TYPE_IDENTIFIER[0]);
        return {
            type: NodeType.CHOICE,
            id: type.ofType,
            id_start: type.ofType_start,
            options: ctx.CHOICE_OPTION.map(o => this.visit(o)),
            options_start: ctx.CHOICE_OPTION.map(o => {
                const literal = o.children.StringLiteral || o.children.NumberLiteral;
                return helpers_1.getStartToken(literal[0]);
            }),
            annotations: helpers_1.purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
        };
    }
    CHOICE_OPTION(ctx) {
        let value = "";
        if (ctx.StringLiteral) {
            value = ctx.StringLiteral[0].image.replace(/"/g, "");
        }
        if (ctx.NumberLiteral) {
            value = +ctx.NumberLiteral[0].image;
        }
        return {
            type: ctx.NumberLiteral ? "number" : "string",
            id: value,
            annotations: helpers_1.purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
        };
    }
    MAP(ctx) {
        // TODO: add directives
        return {
            type: NodeType.MAP,
            directives: [],
            flows: ctx.MAP_FLOW.map(o => this.visit(o))
        };
    }
    MAP_FLOW(ctx) {
        return {
            type: NodeType.MAP_FLOW,
            nodes: helpers_1.purge(ctx.MAP_FLOW_KEY.map(o => this.visit(o)))
        };
    }
    MAP_FLOW_KEY(ctx) {
        if (ctx.Identifier) {
            return ctx.Identifier[0].image;
        }
        else if (ctx.StringLiteral) {
            return ctx.StringLiteral[0].image.replace(/"/g, "");
        }
        else {
            return null;
        }
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
        else if (ctx.SIGN_dot) {
            return {
                ofType: ctx.Identifier[0].image,
                ofType_start: helpers_1.getStartToken(ctx.Identifier[0]),
                ofType_params: [],
                ofType_params_start: [],
                field: ctx.Identifier[1].image,
                fieldStart: helpers_1.getStartToken(ctx.Identifier[1])
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
        const content = ctx.MarkdownChapterLiteral[0].image;
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
    MARKDOWN_IMAGE(ctx) {
        const pattern = /(\[)(.*)(\])(\()(.*)(\))/;
        const segments = pattern.exec(ctx.MarkdownImageLiteral[0].image) || [];
        let uri = segments[5].startsWith("http") ? segments[5] : "file://" + path_1.resolve(segments[5]);
        return {
            type: NodeType.MARKDOWN_IMAGE,
            content: ctx.MarkdownImageLiteral[0].image,
            alt: segments[2],
            uri
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
        const source = (segments[3] || "")
            .trim()
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return {
            type: NodeType.MARKDOWN_CODE,
            content: ctx.MarkdownCodeLiteral[0].image,
            lang: segments[2],
            source: source
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
    ANNOTATIONS(ctx) {
        return this.ROOT_ANNOTATIONS(ctx);
    }
    ANNOTATION(ctx) {
        const pattern = /( *)(@)(.*)(:)(.*)/;
        const result = pattern.exec(ctx.image);
        return result
            ? {
                type: NodeType.ANNOTATION,
                key: result[3].trim().toLowerCase(),
                value: result[5].trim()
            }
            : null;
    }
}
exports.OutlineVisitor = OutlineVisitor;
const parseDirectives = (ctx) => {
    // Parse the Directives in the code.
    const pattern = /( *)(%)(.*)(:)(.*)(\n)/;
    let directives = (ctx.DirectiveLiteral || []).map(d => {
        const segments = pattern.exec(d.image);
        if (segments) {
            return {
                key: segments[3].trim(),
                value: segments[5].trim()
            };
        }
        else {
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
    return directives;
};
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
    NodeType["VIEW"] = "VIEW";
    NodeType["AGGREGATE"] = "AGGREGATE";
    NodeType["PARAGRAPH"] = "PARAGRAPH";
    NodeType["MARKDOWN_CODE"] = "MARKDOWN_CODE";
    NodeType["MARKDOWN_PARAGRAPH"] = "MARKDOWN_PARAGRAPH";
    NodeType["MARKDOWN_IMAGE"] = "MARKDOWN_IMAGE";
    NodeType["MARKDOWN_CHAPTER"] = "MARKDOWN_CHAPTER";
    NodeType["MARKDOWN_LIST"] = "MARKDOWN_LIST";
    NodeType["CHOICE"] = "CHOICE";
    NodeType["PLUCKED_FIELD"] = "PLUCKED_FIELD";
    NodeType["OPEN"] = "OPEN";
    NodeType["FLOW"] = "FLOW";
    NodeType["OPERATION"] = "OPERATION";
    NodeType["OPERATION_PARAMETER"] = "OPERATION_PARAMETER";
    NodeType["MAP"] = "MAP";
    NodeType["MAP_FLOW"] = "MAP_FLOW";
    NodeType["PUB"] = "PUB";
    NodeType["SUB"] = "SUB";
    NodeType["FIRE_FORGET"] = "FIRE_FORGET";
    NodeType["FLOW_FUNCTION"] = "FLOW_FUNCTION";
    NodeType["GUIDELINE"] = "GUIDELINE";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
const defaultStart = {
    startLineNumber: 0,
    endLineNumber: 0,
    startColumn: 0,
    endColumn: 0
};
//# sourceMappingURL=outline.js.map