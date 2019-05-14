"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const lexer_1 = require("./lexer");
class DomainParser extends chevrotain_1.Parser {
    constructor() {
        super(lexer_1.tokenLookup);
        const $ = this;
        $.RULE("START", () => {
            $.MANY(() => $.SUBRULE($.EXPRESSION));
        });
        $.RULE("EXPRESSION", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.CommentBlock) },
                { ALT: () => $.SUBRULE($.TYPE) },
                { ALT: () => $.SUBRULE($.ALIAS) },
                { ALT: () => $.SUBRULE($.DATA) },
                { ALT: () => $.SUBRULE($.VIEW) },
                { ALT: () => $.SUBRULE($.CHOICE) },
                { ALT: () => $.SUBRULE($.OPEN) },
                { ALT: () => $.SUBRULE($.AGGREGATE) },
                { ALT: () => $.SUBRULE($.GUIDELINE) },
                { ALT: () => $.SUBRULE($.MAP) },
                { ALT: () => $.SUBRULE($.FLOW) },
                { ALT: () => $.SUBRULE($.MARKDOWN_CHAPTER) },
                { ALT: () => $.SUBRULE($.MARKDOWN_PARAGRAPH) },
                { ALT: () => $.SUBRULE($.MARKDOWN_IMAGE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_CODE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_LIST) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.EndBlock) }
            ]);
        });
        $.RULE("OPEN", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_open);
            $.AT_LEAST_ONE_SEP({
                SEP: lexer_1.tokenLookup.SIGN_dot,
                DEF: () => $.CONSUME(lexer_1.tokenLookup.Identifier)
            });
            $.SUBRULE($.IMPORTING);
        });
        $.RULE("IMPORTING", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_importing);
            $.CONSUME(lexer_1.tokenLookup.SIGN_collectionOpen);
            $.AT_LEAST_ONE_SEP1({
                SEP: lexer_1.tokenLookup.SIGN_collectionSeparator,
                DEF: () => $.CONSUME1(lexer_1.tokenLookup.Identifier)
            });
            $.CONSUME(lexer_1.tokenLookup.SIGN_collectionClose);
        });
        $.RULE("TYPE", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_type);
            $.SUBRULE($.IDENTIFIER);
            $.OPTION(() => {
                $.CONSUME(lexer_1.tokenLookup.KW_extends);
                $.AT_LEAST_ONE1(() => $.CONSUME1(lexer_1.tokenLookup.Identifier));
            });
            $.OPTION1(() => {
                $.CONSUME(lexer_1.tokenLookup.SIGN_EqualsType);
                $.AT_LEAST_ONE2({
                    DEF: () => $.SUBRULE($.TYPE_FIELD)
                });
            });
        });
        $.RULE("TYPE_FIELD", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.AT_LEAST_ONE1(() => $.CONSUME(lexer_1.tokenLookup.Indent));
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($.IDENTIFIER);
                        $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
                        $.SUBRULE($.TYPE_IDENTIFIER);
                        $.MANY({
                            GATE: this.isRestriction,
                            DEF: () => $.SUBRULE($.RESTRICTION)
                        });
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(lexer_1.tokenLookup.KW_pluck);
                        $.AT_LEAST_ONE_SEP({
                            SEP: lexer_1.tokenLookup.SIGN_dot,
                            DEF: () => $.CONSUME(lexer_1.tokenLookup.Identifier)
                        });
                    }
                }
            ]);
        });
        $.RULE("ALIAS", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_alias);
            $.SUBRULE($.IDENTIFIER);
            $.CONSUME(lexer_1.tokenLookup.SIGN_EqualsAlias);
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.MANY({
                GATE: this.isRestriction,
                DEF: () => $.SUBRULE($.RESTRICTION)
            });
        });
        $.RULE("DATA", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_data);
            $.SUBRULE($.IDENTIFIER);
            $.CONSUME(lexer_1.tokenLookup.SIGN_EqualsData);
            $.AT_LEAST_ONE(() => $.SUBRULE($.DATA_OPTION));
        });
        $.RULE("DATA_OPTION", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.CONSUME(lexer_1.tokenLookup.Indent);
            $.CONSUME(lexer_1.tokenLookup.SIGN_Or);
            $.SUBRULE($.IDENTIFIER);
        });
        $.RULE("CHOICE", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_choice);
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.CONSUME(lexer_1.tokenLookup.SIGN_Equals);
            $.AT_LEAST_ONE(() => $.SUBRULE($.CHOICE_OPTION));
        });
        $.RULE("CHOICE_OPTION", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.CONSUME(lexer_1.tokenLookup.Indent);
            $.CONSUME(lexer_1.tokenLookup.SIGN_Or);
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.StringLiteral) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.NumberLiteral) }
            ]);
        });
        $.RULE("VIEW", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_view);
            $.OPTION(() => $.CONSUME(lexer_1.tokenLookup.ViewIdentifier));
            $.CONSUME(lexer_1.tokenLookup.SIGN_open);
            $.MANY(() => {
                $.CONSUME(lexer_1.tokenLookup.DirectiveLiteral);
            });
            $.MANY2(() => {
                $.AT_LEAST_ONE1(() => $.CONSUME1(lexer_1.tokenLookup.Indent));
                $.CONSUME1(lexer_1.tokenLookup.Identifier);
            });
            $.CONSUME(lexer_1.tokenLookup.SIGN_close);
        });
        $.RULE("AGGREGATE", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_aggregate);
            $.OPTION(() => $.CONSUME(lexer_1.tokenLookup.ViewIdentifier));
            $.CONSUME(lexer_1.tokenLookup.SIGN_open);
            $.MANY(() => {
                $.CONSUME(lexer_1.tokenLookup.DirectiveLiteral);
            });
            $.MANY1(() => {
                $.CONSUME1(lexer_1.tokenLookup.Indent);
                $.CONSUME(lexer_1.tokenLookup.Identifier);
            });
            $.CONSUME(lexer_1.tokenLookup.SIGN_close);
        });
        $.RULE("GUIDELINE", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_guideline);
            $.CONSUME(lexer_1.tokenLookup.SIGN_open);
            $.MANY(() => {
                $.CONSUME(lexer_1.tokenLookup.DirectiveLiteral);
            });
            $.MANY1(() => {
                $.SUBRULE($.MARKDOWN);
            });
            $.CONSUME(lexer_1.tokenLookup.SIGN_close);
        });
        $.RULE("MARKDOWN", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.MARKDOWN_CHAPTER) },
                { ALT: () => $.SUBRULE($.MARKDOWN_PARAGRAPH) },
                { ALT: () => $.SUBRULE($.MARKDOWN_IMAGE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_CODE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_LIST) }
            ]);
        });
        $.RULE("FLOW", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_flow);
            $.CONSUME(lexer_1.tokenLookup.SIGN_open);
            $.MANY(() => $.CONSUME(lexer_1.tokenLookup.DirectiveLiteral));
            $.MANY1(() => $.SUBRULE($.OPERATION));
            $.CONSUME(lexer_1.tokenLookup.SIGN_close);
        });
        $.RULE("OPERATION", () => {
            $.MANY(() => $.CONSUME(lexer_1.tokenLookup.AnnotationLiteral));
            $.AT_LEAST_ONE(() => $.CONSUME(lexer_1.tokenLookup.Indent));
            $.OR([
                { GATE: $.isSub, ALT: () => $.SUBRULE($.FLOW_SUB) },
                { GATE: $.isPub, ALT: () => $.SUBRULE($.FLOW_PUB) },
                { ALT: () => $.SUBRULE($.FLOW_SYSTEM) },
                { ALT: () => $.SUBRULE($.FLOW_FUNCTION) }
            ]);
        });
        $.RULE("FLOW_FUNCTION", () => {
            $.CONSUME(lexer_1.tokenLookup.GenericParameter);
            $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
            $.CONSUME1(lexer_1.tokenLookup.SIGN_TypeDefStart);
            // the parameters
            $.AT_LEAST_ONE_SEP({
                SEP: lexer_1.tokenLookup.SIGN_arrow,
                DEF: () => $.SUBRULE($.OPERATION_PARAMETER)
            });
        });
        $.RULE("FLOW_SUB", () => {
            // "CustomerService" sub "Customer Requested" :: String
            // "CustomerService" sub "Customer Requested"
            $.SUBRULE($.ID_OR_STRING);
            $.CONSUME(lexer_1.tokenLookup.KW_sub);
            $.SUBRULE1($.ID_OR_STRING);
            // ::
            $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
            $.CONSUME2(lexer_1.tokenLookup.SIGN_TypeDefStart);
            // params
            $.AT_LEAST_ONE_SEP({
                SEP: lexer_1.tokenLookup.SIGN_arrow,
                DEF: () => $.SUBRULE($.OPERATION_PARAMETER)
            });
        });
        $.RULE("FLOW_PUB", () => {
            // "CustomerService" pub to CustomerReceived :: Customer
            $.SUBRULE($.ID_OR_STRING);
            $.CONSUME(lexer_1.tokenLookup.KW_pub);
            $.SUBRULE1($.ID_OR_STRING);
            // ::
            $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
            $.CONSUME2(lexer_1.tokenLookup.SIGN_TypeDefStart);
            // params
            $.AT_LEAST_ONE_SEP({
                SEP: lexer_1.tokenLookup.SIGN_arrow,
                DEF: () => $.SUBRULE($.OPERATION_PARAMETER)
            });
        });
        $.RULE("FLOW_SYSTEM", () => {
            // Consume the system definition
            // ("Entity Service", SAP) ::
            $.CONSUME(lexer_1.tokenLookup.SIGN_wrapOpen);
            $.SUBRULE($.ID_OR_STRING);
            $.CONSUME(lexer_1.tokenLookup.SIGN_collectionSeparator);
            $.SUBRULE2($.ID_OR_STRING);
            $.CONSUME(lexer_1.tokenLookup.SIGN_wrapClose);
            $.OPTION(() => $.CONSUME(lexer_1.tokenLookup.SIGN_fireAndForget));
            $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
            $.CONSUME2(lexer_1.tokenLookup.SIGN_TypeDefStart);
            // Now for the system part which is exactly the same as
            // the function description in the FLOW_FUNCTION
            $.AT_LEAST_ONE_SEP({
                SEP: lexer_1.tokenLookup.SIGN_arrow,
                DEF: () => $.SUBRULE($.OPERATION_PARAMETER)
            });
        });
        $.RULE("OPERATION_PARAMETER", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.OPERATION_PARAMETER_FIELD_TYPE) },
                { ALT: () => $.SUBRULE($.OPERATION_PARAMETER_TYPE) }
            ]);
        });
        $.RULE("OPERATION_PARAMETER_FIELD_TYPE", () => {
            $.CONSUME(lexer_1.tokenLookup.SIGN_wrapOpen);
            $.CONSUME(lexer_1.tokenLookup.GenericParameter);
            $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.CONSUME(lexer_1.tokenLookup.SIGN_wrapClose);
        });
        $.RULE("OPERATION_PARAMETER_TYPE", () => {
            $.SUBRULE($.TYPE_IDENTIFIER);
        });
        $.RULE("ID_OR_STRING", () => {
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.GenericIdentifier) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.Identifier) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.StringLiteral) }
            ]);
        });
        $.RULE("RESTRICTION", () => {
            $.AT_LEAST_ONE(() => {
                $.CONSUME(lexer_1.tokenLookup.Indent);
            });
            $.CONSUME(lexer_1.tokenLookup.SIGN_Restriction);
            $.CONSUME(lexer_1.tokenLookup.RestrictionIdentifier);
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.NumberLiteral) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.StringLiteral) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.PatternLiteral) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.BooleanLiteral) }
            ]);
        });
        $.RULE("MAP", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_map);
            $.CONSUME(lexer_1.tokenLookup.SIGN_open);
            $.MANY(() => $.SUBRULE($.MAP_FLOW));
            $.CONSUME(lexer_1.tokenLookup.SIGN_close);
        });
        $.RULE("MAP_FLOW", () => {
            $.OPTION(() => lexer_1.tokenLookup.Indent);
            $.AT_LEAST_ONE_SEP({
                SEP: lexer_1.tokenLookup.SIGN_arrow,
                DEF: () => {
                    $.SUBRULE($.MAP_FLOW_KEY);
                }
            });
        });
        $.RULE("MAP_FLOW_KEY", () => {
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.Identifier) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.StringLiteral) }
            ]);
        });
        $.RULE("TYPE_IDENTIFIER", () => {
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.GenericParameter) },
                {
                    ALT: () => {
                        $.CONSUME(lexer_1.tokenLookup.GenericIdentifier);
                        $.AT_LEAST_ONE(() => {
                            $.CONSUME1(lexer_1.tokenLookup.GenericParameter);
                        });
                    }
                },
                {
                    ALT: () => {
                        $.AT_LEAST_ONE1(() => {
                            $.CONSUME(lexer_1.tokenLookup.Identifier);
                        });
                    }
                }
            ]);
        });
        /**
         * The is the type identifier. The Type identifier identifies the
         * type whcih is expressed. For example:
         *
         * Integer
         * Maybe String
         *
         * Are type identifiers
         */
        $.RULE("IDENTIFIER", () => {
            $.OR([
                {
                    ALT: () => {
                        $.CONSUME(lexer_1.tokenLookup.GenericIdentifier);
                        $.MANY({
                            GATE: this.isGenericParameter,
                            DEF: () => $.CONSUME1(lexer_1.tokenLookup.GenericParameter)
                        });
                    }
                },
                {
                    ALT: () => {
                        $.AT_LEAST_ONE1(() => {
                            $.CONSUME(lexer_1.tokenLookup.Identifier);
                        });
                    }
                },
                {
                    ALT: () => $.CONSUME(lexer_1.tokenLookup.FieldName)
                }
            ]);
        });
        $.RULE("ANNOTATIONS", () => {
            $.MANY({
                GATE: $.isAnnotation,
                DEF: () => $.CONSUME(lexer_1.tokenLookup.AnnotationLiteral)
            });
        });
        $.RULE("CHOICE_ANNOTATION", () => {
            $.MANY(() => {
                $.CONSUME(lexer_1.tokenLookup.AnnotationLiteral);
            });
        });
        // $.RULE("ROOT_ANNOTATIONS", () => {
        //     $.MANY(() => $.CONSUME(tokenLookup.AnnotationLiteral));
        // });
        /* MARKDOWN RULES */
        $.RULE("MARKDOWN_CHAPTER", () => {
            $.CONSUME(lexer_1.tokenLookup.MarkdownChapterLiteral);
        });
        $.RULE("MARKDOWN_LIST", () => {
            $.CONSUME(lexer_1.tokenLookup.MarkdownListLiteral);
        });
        $.RULE("MARKDOWN_PARAGRAPH", () => {
            $.CONSUME(lexer_1.tokenLookup.MarkdownParagraphLiteral);
        });
        $.RULE("MARKDOWN_CODE", () => {
            $.CONSUME(lexer_1.tokenLookup.MarkdownCodeLiteral);
        });
        $.RULE("MARKDOWN_IMAGE", () => {
            $.CONSUME(lexer_1.tokenLookup.MarkdownImageLiteral);
        });
        this.performSelfAnalysis();
    }
    isAnnotation() {
        let t1 = this.LA(1);
        let t2 = this.LA(2);
        if (t1 && t1.tokenType && t1.tokenType.tokenName === "Indent") {
            return t2 && t2.tokenType && t2.tokenType.tokenName === "AnnotationLiteral";
        }
        return t1 && t1.tokenType && t1.tokenType.tokenName === "AnnotationLiteral";
    }
    isRestriction() {
        let t2 = this.LA(2); // either Indent or SIGN_Restriction
        let t3 = this.LA(3); // if t2 is Indent this one should be SIGN_Restriction
        const isOr = t => {
            return t && t.tokenType && t.tokenType.tokenName === "SIGN_Restriction";
        };
        return isOr(t2) || isOr(t3);
    }
    isGenericParameter() {
        let t1 = this.LA(1);
        return t1.image !== "extends";
    }
    isSub() {
        let t2 = this.LA(2);
        return t2.image === "sub";
    }
    isPub() {
        let t2 = this.LA(2);
        return t2.image === "pub";
    }
}
exports.parser = new DomainParser();
//# sourceMappingURL=parser.js.map