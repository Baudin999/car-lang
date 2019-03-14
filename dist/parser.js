"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const lexer_1 = require("./lexer");
class DomainParser extends chevrotain_1.Parser {
    constructor() {
        super(lexer_1.tokenLookup, {
        // passing our custom error message provider
        //errorMessageProvider: carErrorProvider
        });
        const $ = this;
        $.RULE("START", () => {
            $.MANY(() => $.SUBRULE($.EXPRESSION));
        });
        $.RULE("EXPRESSION", () => {
            $.SUBRULE($.ROOT_ANNOTATIONS);
            $.OR([
                { ALT: () => $.SUBRULE($.TYPE) },
                { ALT: () => $.SUBRULE($.ALIAS) },
                { ALT: () => $.SUBRULE($.DATA) },
                { ALT: () => $.SUBRULE($.ASSIGNMENT) },
                { ALT: () => $.SUBRULE($.MARKDOWN_CHAPTER) },
                { ALT: () => $.SUBRULE($.MARKDOWN_PARAGRAPH) },
                { ALT: () => $.SUBRULE($.MARKDOWN_IMAGE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_CODE) },
                { ALT: () => $.SUBRULE($.MARKDOWN_LIST) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.CommentBlock) }
            ]);
        });
        $.RULE("TYPE", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_Type);
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
            $.CONSUME(lexer_1.tokenLookup.Indent);
            $.SUBRULE($.IDENTIFIER);
            $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
            $.SUBRULE($.TYPE_IDENTIFIER);
            $.MANY({
                GATE: this.isRestriction,
                DEF: () => $.SUBRULE($.RESTRICTION)
            });
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
                GATE: this.isAnnotation,
                DEF: () => {
                    $.CONSUME(lexer_1.tokenLookup.Indent);
                    $.CONSUME(lexer_1.tokenLookup.Annotation);
                }
            });
        });
        $.RULE("ROOT_ANNOTATIONS", () => {
            $.MANY(() => $.CONSUME(lexer_1.tokenLookup.Annotation));
        });
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
        /* WEAK ATTEMPT AT FUNCTIONS AND VARIABLES */
        $.RULE("ASSIGNMENT", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_let);
            $.CONSUME(lexer_1.tokenLookup.ValiableIdentifier);
            $.SUBRULE($.PARAMETERS);
            $.CONSUME(lexer_1.tokenLookup.SIGN_Equals);
            $.SUBRULE($.STATEMENT);
        });
        $.RULE("PARAMETERS", () => {
            $.MANY(() => $.CONSUME(lexer_1.tokenLookup.ValiableIdentifier));
        });
        $.RULE("STATEMENT", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.BINARY_EXPRESSION) },
                { ALT: () => $.SUBRULE($.VALUE_EXPRESSION) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.ValiableIdentifier) }
            ]);
        });
        $.RULE("VALUE_EXPRESSION", () => {
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.NumberLiteral) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.StringLiteral) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.PatternLiteral) }
            ]);
        });
        $.RULE("BINARY_EXPRESSION", () => {
            $.CONSUME(lexer_1.tokenLookup.ValiableIdentifier);
            $.CONSUME(lexer_1.tokenLookup.Operator);
            $.SUBRULE($.STATEMENT);
        });
        this.performSelfAnalysis();
    }
    isAnnotation() {
        let t1 = this.LA(1);
        let t2 = this.LA(2);
        if (t1 && t1.tokenType && t1.tokenType.tokenName === "Indent") {
            return t2 && t2.tokenType && t2.tokenType.tokenName === "Annotation";
        }
        return t1 && t1.tokenType && t1.tokenType.tokenName === "Annotation";
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
}
exports.parser = new DomainParser();
//# sourceMappingURL=parser.js.map