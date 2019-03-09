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
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.Identifier) },
                {
                    ALT: () => {
                        $.CONSUME(lexer_1.tokenLookup.GenericIdentifier);
                        $.MANY(() => {
                            $.CONSUME1(lexer_1.tokenLookup.GenericParameter);
                        });
                    }
                }
            ]);
            $.MANY1(() => $.CONSUME(lexer_1.tokenLookup.GenericParameter));
            $.OPTION2(() => {
                $.CONSUME(lexer_1.tokenLookup.SIGN_EqualsType);
                $.AT_LEAST_ONE({
                    DEF: () => $.SUBRULE($.TYPE_FIELD)
                });
            });
        });
        $.RULE("TYPE_FIELD", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.CONSUME(lexer_1.tokenLookup.Indent);
            $.CONSUME(lexer_1.tokenLookup.FieldName);
            $.CONSUME(lexer_1.tokenLookup.SIGN_TypeDefStart);
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.GenericParameter) },
                {
                    ALT: () => {
                        $.CONSUME(lexer_1.tokenLookup.GenericIdentifier);
                        $.MANY(() => {
                            $.CONSUME1(lexer_1.tokenLookup.GenericParameter);
                        });
                    }
                },
                {
                    ALT: () => {
                        $.AT_LEAST_ONE(() => {
                            $.OR1([
                                { ALT: () => $.CONSUME(lexer_1.tokenLookup.Identifier) },
                                { ALT: () => $.CONSUME(lexer_1.tokenLookup.ConcreteIdentifier) },
                                { ALT: () => $.CONSUME(lexer_1.tokenLookup.StringLiteral) },
                                { ALT: () => $.CONSUME(lexer_1.tokenLookup.NumberLiteral) },
                                { ALT: () => $.CONSUME(lexer_1.tokenLookup.PatternLiteral) }
                            ]);
                        });
                    }
                }
            ]);
        });
        $.RULE("ALIAS", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_Alias);
            $.CONSUME(lexer_1.tokenLookup.Identifier);
            $.CONSUME(lexer_1.tokenLookup.SIGN_EqualsAlias);
            $.SUBRULE($.ALIAS_FOR);
        });
        $.RULE("ALIAS_FOR", () => {
            $.AT_LEAST_ONE(() => {
                $.OR([
                    { ALT: () => $.CONSUME(lexer_1.tokenLookup.Identifier) },
                    { ALT: () => $.CONSUME(lexer_1.tokenLookup.ConcreteIdentifier) },
                    { ALT: () => $.CONSUME(lexer_1.tokenLookup.StringLiteral) },
                    { ALT: () => $.CONSUME(lexer_1.tokenLookup.NumberLiteral) },
                    { ALT: () => $.CONSUME(lexer_1.tokenLookup.PatternLiteral) }
                ]);
            });
        });
        $.RULE("DATA", () => {
            $.CONSUME(lexer_1.tokenLookup.KW_data);
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.Identifier) },
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.GenericIdentifier) }
            ]);
            $.MANY(() => $.CONSUME(lexer_1.tokenLookup.GenericParameter));
            $.CONSUME(lexer_1.tokenLookup.SIGN_EqualsData);
            $.AT_LEAST_ONE(() => $.SUBRULE($.DATA_OPTION));
        });
        $.RULE("DATA_OPTION", () => {
            $.SUBRULE($.ANNOTATIONS);
            $.CONSUME(lexer_1.tokenLookup.Indent);
            $.CONSUME(lexer_1.tokenLookup.SIGN_Or);
            $.OR([
                { ALT: () => $.CONSUME(lexer_1.tokenLookup.Identifier) },
                {
                    ALT: () => {
                        $.CONSUME(lexer_1.tokenLookup.GenericIdentifier);
                        $.MANY(() => {
                            $.CONSUME1(lexer_1.tokenLookup.GenericParameter);
                        });
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(lexer_1.tokenLookup.ConcreteIdentifier);
                        $.MANY1(() => {
                            $.CONSUME1(lexer_1.tokenLookup.Identifier);
                        });
                    }
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
}
exports.parser = new DomainParser();
//# sourceMappingURL=parser.js.map