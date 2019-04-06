import { Parser, IToken } from "chevrotain";
import { tokenLookup } from "./lexer";
import { Modify as ModifyLet, modTokens } from "./lexer.let";

class DomainParser extends Parser {
    START: any;
    EXPRESSION: any;

    TYPE: any;
    TYPE_FIELD: any;
    ALIAS: any;
    ALIAS_FOR: any;
    DATA: any;
    DATA_OPTION: any;
    CHOICE: any;
    CHOICE_OPTION: any;
    VIEW: any;
    RESTRICTION: any;
    PARAMETERS: any;
    STATEMENT: any;
    BINARY_EXPRESSION: any;
    VALUE_EXPRESSION: any;
    FUNCTION_APPLICATION: any;
    OPEN: any;
    IMPORTING: any;
    AGGREGATE: any;
    FLOW: any;
    OPERATION: any;
    OPERATION_RESULT: any;
    OPERATION_PARAMETER: any;
    OPERATION_PARAMETER_TYPE: any;
    OPERATION_PARAMETER_FIELD_TYPE: any;

    IDENTIFIER: any;
    TYPE_IDENTIFIER: any;

    //ROOT_ANNOTATIONS: any;
    ANNOTATIONS: any;
    ANNOTATION: any;

    MARKDOWN_CHAPTER: any;
    MARKDOWN_PARAGRAPH: any;
    MARKDOWN_IMAGE: any;
    MARKDOWN_CODE: any;
    MARKDOWN_LIST: any;

    constructor() {
        let tokens = modTokens(tokenLookup);
        super(tokens, {
            // passing our custom error message provider
            //errorMessageProvider: carErrorProvider
        } as any);

        const $ = this;

        //ModifyLet($, tokenLookup);

        $.RULE("START", () => {
            $.MANY(() => $.SUBRULE($.EXPRESSION));
        });

        $.RULE("EXPRESSION", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.OR([
                { ALT: () => $.CONSUME(tokenLookup.CommentBlock) },
                { ALT: () => $.SUBRULE($.TYPE) },
                { ALT: () => $.SUBRULE($.ALIAS) },
                { ALT: () => $.SUBRULE($.DATA) },
                { ALT: () => $.SUBRULE($.VIEW) },
                { ALT: () => $.SUBRULE($.CHOICE) },
                { ALT: () => $.SUBRULE($.OPEN) },
                { ALT: () => $.SUBRULE($.AGGREGATE) },
                { ALT: () => $.SUBRULE($.FLOW) },
                { ALT: () => $.SUBRULE($.MARKDOWN_CHAPTER) },
                { ALT: () => $.SUBRULE($.MARKDOWN_PARAGRAPH) },
                { ALT: () => $.SUBRULE($.MARKDOWN_IMAGE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_CODE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_LIST) },
                { ALT: () => $.CONSUME(tokenLookup.EndBlock) }
            ]);
        });

        $.RULE("OPEN", () => {
            $.CONSUME(tokenLookup.KW_open);
            $.AT_LEAST_ONE_SEP({
                SEP: tokenLookup.SIGN_dot,
                DEF: () => $.CONSUME(tokenLookup.Identifier)
            });
            $.SUBRULE($.IMPORTING);
        });

        $.RULE("IMPORTING", () => {
            $.CONSUME(tokenLookup.KW_importing);
            $.CONSUME(tokenLookup.SIGN_collectionOpen);
            $.AT_LEAST_ONE_SEP1({
                SEP: tokenLookup.SIGN_collectionSeparator,
                DEF: () => $.CONSUME1(tokenLookup.Identifier)
            });
            $.CONSUME(tokenLookup.SIGN_collectionClose);
        });

        $.RULE("TYPE", () => {
            $.CONSUME(tokenLookup.KW_type);
            $.SUBRULE($.IDENTIFIER);

            $.OPTION(() => {
                $.CONSUME(tokenLookup.KW_extends);
                $.AT_LEAST_ONE1(() => $.CONSUME1(tokenLookup.Identifier));
            });

            $.OPTION1(() => {
                $.CONSUME(tokenLookup.SIGN_EqualsType);
                $.AT_LEAST_ONE2({
                    DEF: () => $.SUBRULE($.TYPE_FIELD)
                });
            });
        });

        $.RULE("TYPE_FIELD", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.AT_LEAST_ONE1(() => $.CONSUME(tokenLookup.Indent));

            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($.IDENTIFIER);
                        $.CONSUME(tokenLookup.SIGN_TypeDefStart);
                        $.SUBRULE($.TYPE_IDENTIFIER);
                        $.MANY({
                            GATE: this.isRestriction as any,
                            DEF: () => $.SUBRULE($.RESTRICTION)
                        });
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(tokenLookup.KW_pluck);
                        $.AT_LEAST_ONE_SEP({
                            SEP: tokenLookup.SIGN_dot,
                            DEF: () => $.CONSUME(tokenLookup.Identifier)
                        });
                    }
                }
            ]);
        });

        $.RULE("ALIAS", () => {
            $.CONSUME(tokenLookup.KW_alias);
            $.SUBRULE($.IDENTIFIER);
            $.CONSUME(tokenLookup.SIGN_EqualsAlias);
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.MANY({
                GATE: this.isRestriction as any,
                DEF: () => $.SUBRULE($.RESTRICTION)
            });
        });

        $.RULE("DATA", () => {
            $.CONSUME(tokenLookup.KW_data);
            $.SUBRULE($.IDENTIFIER);
            $.CONSUME(tokenLookup.SIGN_EqualsData);
            $.AT_LEAST_ONE(() => $.SUBRULE($.DATA_OPTION));
        });

        $.RULE("DATA_OPTION", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.CONSUME(tokenLookup.Indent);
            $.CONSUME(tokenLookup.SIGN_Or);
            $.SUBRULE($.IDENTIFIER);
        });

        $.RULE("CHOICE", () => {
            $.CONSUME(tokenLookup.KW_choice);
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.CONSUME(tokenLookup.SIGN_Equals);
            $.AT_LEAST_ONE(() => $.SUBRULE($.CHOICE_OPTION));
        });

        $.RULE("CHOICE_OPTION", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.CONSUME(tokenLookup.Indent);
            $.CONSUME(tokenLookup.SIGN_Or);
            $.OR([
                { ALT: () => $.CONSUME(tokenLookup.StringLiteral) },
                { ALT: () => $.CONSUME(tokenLookup.NumberLiteral) }
            ]);
        });

        $.RULE("VIEW", () => {
            $.CONSUME(tokenLookup.KW_view);
            $.OPTION(() => $.CONSUME(tokenLookup.ViewIdentifier));
            $.CONSUME(tokenLookup.SIGN_open);
            $.MANY(() => {
                $.CONSUME(tokenLookup.DirectiveLiteral);
            });
            $.MANY2(() => {
                $.AT_LEAST_ONE1(() => $.CONSUME1(tokenLookup.Indent));
                $.CONSUME1(tokenLookup.Identifier);
            });
            $.CONSUME(tokenLookup.SIGN_close);
        });

        $.RULE("AGGREGATE", () => {
            $.CONSUME(tokenLookup.KW_aggregate);
            $.OPTION(() => $.CONSUME(tokenLookup.ViewIdentifier));
            $.CONSUME(tokenLookup.SIGN_open);

            $.MANY(() => {
                $.CONSUME(tokenLookup.DirectiveLiteral);
            });

            $.MANY1(() => {
                $.CONSUME1(tokenLookup.Indent);
                $.CONSUME(tokenLookup.Identifier);
            });
            $.CONSUME(tokenLookup.SIGN_close);
        });

        $.RULE("FLOW", () => {
            $.CONSUME(tokenLookup.KW_flow);
            $.CONSUME(tokenLookup.SIGN_open);
            $.MANY(() => $.CONSUME(tokenLookup.DirectiveLiteral));
            $.MANY1(() => $.SUBRULE($.OPERATION));
            $.CONSUME(tokenLookup.SIGN_close);
        });

        $.RULE("OPERATION", () => {
            $.MANY(() => $.CONSUME(tokenLookup.AnnotationLiteral));
            $.CONSUME(tokenLookup.Indent);
            $.CONSUME(tokenLookup.GenericParameter);
            $.CONSUME(tokenLookup.SIGN_TypeDefStart);
            $.CONSUME1(tokenLookup.SIGN_TypeDefStart);
            $.MANY1(() => $.SUBRULE($.OPERATION_PARAMETER));
            $.SUBRULE($.OPERATION_RESULT);
        });

        $.RULE("OPERATION_PARAMETER", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.OPERATION_PARAMETER_FIELD_TYPE) },
                { ALT: () => $.SUBRULE($.OPERATION_PARAMETER_TYPE) }
            ]);
        });

        $.RULE("OPERATION_PARAMETER_FIELD_TYPE", () => {
            $.CONSUME(tokenLookup.SIGN_wrapOpen);
            $.CONSUME(tokenLookup.GenericParameter);
            $.CONSUME(tokenLookup.SIGN_TypeDefStart);
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.CONSUME(tokenLookup.SIGN_wrapClose);
            $.CONSUME(tokenLookup.SIGN_arrow);
        });

        $.RULE("OPERATION_PARAMETER_TYPE", () => {
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.CONSUME(tokenLookup.SIGN_arrow);
        });

        $.RULE("OPERATION_RESULT", () => {
            $.SUBRULE($.TYPE_IDENTIFIER);
        });

        $.RULE("RESTRICTION", () => {
            $.AT_LEAST_ONE(() => {
                $.CONSUME(tokenLookup.Indent);
            });
            $.CONSUME(tokenLookup.SIGN_Restriction);
            $.CONSUME(tokenLookup.RestrictionIdentifier);
            $.OR([
                { ALT: () => $.CONSUME(tokenLookup.NumberLiteral) },
                { ALT: () => $.CONSUME(tokenLookup.StringLiteral) },
                { ALT: () => $.CONSUME(tokenLookup.PatternLiteral) },
                { ALT: () => $.CONSUME(tokenLookup.BooleanLiteral) }
            ]);
        });

        $.RULE("TYPE_IDENTIFIER", () => {
            $.OR([
                { ALT: () => $.CONSUME(tokenLookup.GenericParameter) },
                {
                    ALT: () => {
                        $.CONSUME(tokenLookup.GenericIdentifier);
                        $.AT_LEAST_ONE(() => {
                            $.CONSUME1(tokenLookup.GenericParameter);
                        });
                    }
                },
                {
                    ALT: () => {
                        $.AT_LEAST_ONE1(() => {
                            $.CONSUME(tokenLookup.Identifier);
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
                        $.CONSUME(tokenLookup.GenericIdentifier);
                        $.MANY({
                            GATE: this.isGenericParameter as any,
                            DEF: () => $.CONSUME1(tokenLookup.GenericParameter)
                        });
                    }
                },
                {
                    ALT: () => {
                        $.AT_LEAST_ONE1(() => {
                            $.CONSUME(tokenLookup.Identifier);
                        });
                    }
                },
                {
                    ALT: () => $.CONSUME(tokenLookup.FieldName)
                }
            ]);
        });

        $.RULE("ANNOTATIONS", () => {
            $.MANY({
                GATE: $.isAnnotation as any,
                DEF: () => $.CONSUME(tokenLookup.AnnotationLiteral)
            });
        });

        // $.RULE("ROOT_ANNOTATIONS", () => {
        //     $.MANY(() => $.CONSUME(tokenLookup.AnnotationLiteral));
        // });

        /* MARKDOWN RULES */
        $.RULE("MARKDOWN_CHAPTER", () => {
            $.CONSUME(tokenLookup.MarkdownChapterLiteral);
        });

        $.RULE("MARKDOWN_LIST", () => {
            $.CONSUME(tokenLookup.MarkdownListLiteral);
        });

        $.RULE("MARKDOWN_PARAGRAPH", () => {
            $.CONSUME(tokenLookup.MarkdownParagraphLiteral);
        });

        $.RULE("MARKDOWN_CODE", () => {
            $.CONSUME(tokenLookup.MarkdownCodeLiteral);
        });

        $.RULE("MARKDOWN_IMAGE", () => {
            $.CONSUME(tokenLookup.MarkdownImageLiteral);
        });

        this.performSelfAnalysis();
    }

    isAnnotation(): boolean | undefined {
        let t1 = this.LA(1) as IToken;
        let t2 = this.LA(2) as IToken;

        if (t1 && t1.tokenType && t1.tokenType.tokenName === "Indent") {
            return t2 && t2.tokenType && t2.tokenType.tokenName === "AnnotationLiteral";
        }
        return t1 && t1.tokenType && t1.tokenType.tokenName === "AnnotationLiteral";
    }

    isRestriction(): boolean | undefined {
        let t2 = this.LA(2) as IToken; // either Indent or SIGN_Restriction
        let t3 = this.LA(3) as IToken; // if t2 is Indent this one should be SIGN_Restriction

        const isOr = t => {
            return t && t.tokenType && t.tokenType.tokenName === "SIGN_Restriction";
        };

        return isOr(t2) || isOr(t3);
    }

    isGenericParameter(): boolean | undefined {
        let t1 = this.LA(1) as IToken;

        return t1.image !== "extends";
    }
}

export const parser = new DomainParser();
