System.register("lexer", ["chevrotain"], function (exports_1, context_1) {
    "use strict";
    var chevrotain_1, EndBlock, CommentBlock, Annotation, KW_Type, KW_Alias, KW_data, KW_let, SIGN_EqualsType, SIGN_EqualsAlias, SIGN_EqualsOption, SIGN_EqualsData, SIGN_Or, SIGN_TypeDefStart, Identifier, RestrictionIdentifier, GenericIdentifier, ConcreteIdentifier, GenericParameter, FieldName, NewLine, Indent, WhiteSpace, NumberLiteral, StringLiteral, PatternLiteral, MarkdownImageLiteral, MarkdownCodeLiteral, MarkdownChapterLiteral, MarkdownListLiteral, MarkdownParagraphLiteral, multiModeLexerDefinition, tokenLookup, DomainLexer;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (chevrotain_1_1) {
                chevrotain_1 = chevrotain_1_1;
            }
        ],
        execute: function () {
            EndBlock = chevrotain_1.createToken({
                name: "EndBlock",
                pattern: /\n(\s*\n)+(?!\s)/,
                push_mode: "root",
                group: chevrotain_1.Lexer.SKIPPED
            });
            CommentBlock = chevrotain_1.createToken({
                name: "CommentBlock",
                pattern: /({\*)[^*}]*(\*})(?= *\n)/
            });
            Annotation = chevrotain_1.createToken({
                name: "Annotation",
                pattern: /(@) *([a-z][a-zA-Z0-9_-]* *:)?(.+)\n/
            });
            KW_Type = chevrotain_1.createToken({
                pattern: /type/,
                name: "KW_Type",
                push_mode: "type_definition"
            });
            KW_Alias = chevrotain_1.createToken({
                pattern: /alias/,
                name: "KW_Alias",
                push_mode: "alias_definition"
            });
            KW_data = chevrotain_1.createToken({
                pattern: /data/,
                name: "KW_data",
                push_mode: "data_definition"
            });
            KW_let = chevrotain_1.createToken({
                pattern: /let/,
                name: "KW_let",
                push_mode: "let_definition"
            });
            SIGN_EqualsType = chevrotain_1.createToken({
                name: "SIGN_EqualsType",
                pattern: /=/,
                push_mode: "type_field_definition"
            });
            SIGN_EqualsAlias = chevrotain_1.createToken({
                name: "SIGN_EqualsAlias",
                pattern: /=/
            });
            SIGN_EqualsOption = chevrotain_1.createToken({
                name: "SIGN_EqualsOption",
                pattern: /=/,
                push_mode: "option_field_definition"
            });
            SIGN_EqualsData = chevrotain_1.createToken({
                name: "SIGN_EqualsData",
                pattern: /=/,
                push_mode: "data_field_definition"
            });
            SIGN_Or = chevrotain_1.createToken({
                name: "SIGN_Or",
                pattern: /\|/
            });
            SIGN_TypeDefStart = chevrotain_1.createToken({
                name: "SIGN_TypeDefStart",
                pattern: /:/
            });
            Identifier = chevrotain_1.createToken({
                name: "Identifier",
                pattern: /[A-Z][a-zA-Z0-9_]*/
            });
            RestrictionIdentifier = chevrotain_1.createToken({
                name: "RestrictionIdentifier",
                pattern: /[a-z][a-zA-Z0-9_]*(?= +)/
            });
            GenericIdentifier = chevrotain_1.createToken({
                name: "GenericIdentifier",
                pattern: /[A-Z][a-zA-Z0-9_]*(?= +[a-z])/
            });
            ConcreteIdentifier = chevrotain_1.createToken({
                name: "ConcreteIdentifier",
                pattern: /[A-Z][a-zA-Z0-9_]*(?= +[A-Z])/
            });
            GenericParameter = chevrotain_1.createToken({
                name: "GenericParameter",
                pattern: /[a-z][a-zA-Z0-9_]*/
            });
            FieldName = chevrotain_1.createToken({
                name: "FieldName",
                pattern: /[A-Z][a-zA-Z0-9_]*(?= *:)/
            });
            NewLine = chevrotain_1.createToken({
                name: "NewLine",
                pattern: /\n(?=\s+)/,
                group: chevrotain_1.Lexer.SKIPPED
            });
            Indent = chevrotain_1.createToken({
                pattern: /( {2})\s*/,
                name: "Indent"
            });
            WhiteSpace = chevrotain_1.createToken({
                pattern: /\s/,
                name: "WhiteSpace",
                group: chevrotain_1.Lexer.SKIPPED
            });
            /* VALUE LITERALS */
            NumberLiteral = chevrotain_1.createToken({
                name: "NumberLiteral",
                pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
            });
            StringLiteral = chevrotain_1.createToken({
                name: "StringLiteral",
                pattern: /(["'])(?:(?=(\\?))\2.)*?\1/
            });
            PatternLiteral = chevrotain_1.createToken({
                name: "PatternLiteral",
                pattern: /\/.+\//
            });
            /* MARKDOWN */
            MarkdownImageLiteral = chevrotain_1.createToken({
                name: "MarkdownImageLiteral",
                pattern: /\[.*\]\(.*\)(?= *\n)/
            });
            MarkdownCodeLiteral = chevrotain_1.createToken({
                name: "MarkdownCodeLiteral",
                pattern: /(`{3})([^`]*)(`{3})(?= *\n)/
            });
            MarkdownChapterLiteral = chevrotain_1.createToken({
                name: "MarkdownChapterLiteral",
                pattern: /#+ .*(?= *\n)/
            });
            MarkdownListLiteral = chevrotain_1.createToken({
                name: "MarkdownListLiteral",
                pattern: /([ \t]+\*.*\n?)+/
            });
            MarkdownParagraphLiteral = chevrotain_1.createToken({
                name: "MarkdownParagraphLiteral",
                pattern: /(?![ ]+\*).(.|\n\r?\w)*/
            });
            /* SYSTEM TOKENS - END */
            multiModeLexerDefinition = {
                modes: {
                    root: [
                        KW_Type,
                        KW_Alias,
                        KW_data,
                        KW_let,
                        Annotation,
                        EndBlock,
                        CommentBlock,
                        MarkdownChapterLiteral,
                        MarkdownCodeLiteral,
                        MarkdownImageLiteral,
                        MarkdownListLiteral,
                        MarkdownParagraphLiteral
                    ],
                    type_definition: [
                        SIGN_EqualsType,
                        GenericParameter,
                        GenericIdentifier,
                        Identifier,
                        EndBlock,
                        WhiteSpace,
                        CommentBlock
                    ],
                    type_field_definition: [
                        EndBlock,
                        Indent,
                        Annotation,
                        FieldName,
                        SIGN_TypeDefStart,
                        GenericParameter,
                        GenericIdentifier,
                        ConcreteIdentifier,
                        StringLiteral,
                        NumberLiteral,
                        PatternLiteral,
                        Identifier,
                        NewLine,
                        WhiteSpace,
                        CommentBlock
                    ],
                    alias_definition: [
                        EndBlock,
                        SIGN_EqualsAlias,
                        Indent,
                        ConcreteIdentifier,
                        GenericIdentifier,
                        StringLiteral,
                        NumberLiteral,
                        PatternLiteral,
                        Identifier,
                        NewLine,
                        WhiteSpace,
                        CommentBlock
                    ],
                    data_definition: [
                        SIGN_EqualsData,
                        GenericParameter,
                        GenericIdentifier,
                        Identifier,
                        EndBlock,
                        WhiteSpace,
                        CommentBlock
                    ],
                    data_field_definition: [
                        EndBlock,
                        Annotation,
                        SIGN_Or,
                        GenericIdentifier,
                        Identifier,
                        GenericParameter,
                        NewLine,
                        Indent,
                        EndBlock,
                        WhiteSpace,
                        CommentBlock
                    ],
                    restriction_field_definition: [
                        SIGN_Or,
                        Annotation,
                        RestrictionIdentifier,
                        EndBlock,
                        CommentBlock
                    ],
                    let_definition: [StringLiteral, NumberLiteral, PatternLiteral]
                },
                defaultMode: "root"
            };
            exports_1("tokenLookup", tokenLookup = {
                // keywords
                KW_Type,
                KW_Alias,
                KW_data,
                SIGN_EqualsType,
                SIGN_EqualsData,
                SIGN_EqualsAlias,
                SIGN_EqualsOption,
                SIGN_Or,
                Annotation,
                Identifier,
                GenericIdentifier,
                ConcreteIdentifier,
                GenericParameter,
                FieldName,
                SIGN_TypeDefStart,
                CommentBlock,
                StringLiteral,
                NumberLiteral,
                PatternLiteral,
                Indent,
                NewLine,
                EndBlock,
                MarkdownChapterLiteral,
                MarkdownCodeLiteral,
                MarkdownImageLiteral,
                MarkdownListLiteral,
                MarkdownParagraphLiteral
            });
            exports_1("DomainLexer", DomainLexer = new chevrotain_1.Lexer(multiModeLexerDefinition));
            // selfService / Household / Calculate Estimate Consumption
        }
    };
});
System.register("parser", ["chevrotain", "lexer"], function (exports_2, context_2) {
    "use strict";
    var chevrotain_2, lexer_1, DomainParser, parser;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (chevrotain_2_1) {
                chevrotain_2 = chevrotain_2_1;
            },
            function (lexer_1_1) {
                lexer_1 = lexer_1_1;
            }
        ],
        execute: function () {
            DomainParser = class DomainParser extends chevrotain_2.Parser {
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
            };
            exports_2("parser", parser = new DomainParser());
        }
    };
});
System.register("tchecker", [], function (exports_3, context_3) {
    "use strict";
    var typeChecker;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [],
        execute: function () {
            /**
             * This is the type checker. We're going to do "soft" type checking
             * because this tool will mostly be used to do some very soft designing
             * and should not be used in a "hard" environment.
             *
             * Eventually we'll want to do things like code generation, auto-completion
             * plucking of types and most of all show where a change will have impact,
             * so impact analysis and general "tree shaking".
             *
             * Severity can be:
             * 1: "Hint", 2: "Info", 4: "Warning", 8: "Error"
             *
             *
             * @param {AST} ast
             */
            exports_3("typeChecker", typeChecker = (ast = []) => {
                return ast
                    .filter((node) => node._type === "ALIAS")
                    .map((node) => (Object.assign({}, node.tokens.start, { severity: 4, message: "Unused alias." })));
            });
        }
    };
});
System.register("helpers", [], function (exports_4, context_4) {
    "use strict";
    var getStartToken, flatten, purge, clone, baseTypes;
    var __moduleName = context_4 && context_4.id;
    /**
     * Fold a long line and intersperse with newlines at certain intervals
     * @param s - input string
     * @param n - number of chars at which to separate lines
     * @param useSpaces - if true, attempt to insert newlines at whitespace
     * @param a - array used to build result, defaults to new array
     */
    function foldText(s, n = 40, useSpaces = true, a = []) {
        a = a || [];
        if (s.length <= n) {
            a.push(s);
            return a;
        }
        var line = s.substring(0, n);
        if (!useSpaces) {
            // insert newlines anywhere
            a.push(line);
            return foldText(s.substring(n), n, useSpaces, a);
        }
        else {
            // attempt to insert newlines after whitespace
            var lastSpaceRgx = /\s(?!.*\s)/;
            var idx = line.search(lastSpaceRgx);
            var nextIdx = n;
            if (idx > 0) {
                line = line.substring(0, idx);
                nextIdx = idx;
            }
            a.push(line);
            return foldText(s.substring(nextIdx), n, useSpaces, a);
        }
    }
    exports_4("foldText", foldText);
    return {
        setters: [],
        execute: function () {
            /**
             *
             * "startLine": 2,
             * "endLine": 2,
             * "startColumn": 14,
             * "endColumn": 19,
             *
             */
            exports_4("getStartToken", getStartToken = (tokenId) => {
                const result = {
                    startLineNumber: tokenId.startLine || tokenId.startLineNumber,
                    endLineNumber: tokenId.endLine || tokenId.endLineNumber,
                    startColumn: tokenId.startColumn,
                    endColumn: tokenId.endColumn + 1
                };
                return result;
            });
            exports_4("flatten", flatten = (items) => {
                return [].concat.apply([], items);
            });
            exports_4("purge", purge = (items) => {
                return flatten(items).filter(i => !!i);
            });
            exports_4("clone", clone = source => {
                return JSON.parse(JSON.stringify(source));
            });
            exports_4("baseTypes", baseTypes = [
                "String",
                "Char",
                "Integer",
                "Number",
                "Decimal",
                "Double",
                "Boolean",
                "Date",
                "Time",
                "DateTime"
            ]);
        }
    };
});
System.register("outline", ["parser", "helpers"], function (exports_5, context_5) {
    "use strict";
    var parser_1, helpers_1, BaseCstVisitorWithDefaults, OutlineVisitor, NodeType;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (parser_1_1) {
                parser_1 = parser_1_1;
            },
            function (helpers_1_1) {
                helpers_1 = helpers_1_1;
            }
        ],
        execute: function () {
            BaseCstVisitorWithDefaults = parser_1.parser.getBaseCstVisitorConstructorWithDefaults();
            OutlineVisitor = class OutlineVisitor extends BaseCstVisitorWithDefaults {
                constructor() {
                    super();
                    this.tags = {};
                    this.validateVisitor();
                }
                START(ctx) {
                    const expressions = ctx.EXPRESSION.map(expression => this.visit(expression));
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
                    return Object.assign({ type: NodeType.TYPE_FIELD }, this.GetIdentity(ctx), { fields: ctx.SIGN_EqualsType ? ctx.TYPE_FIELD.map(f => this.visit(f)) : [] });
                }
                TYPE_FIELD(ctx) {
                    const items = helpers_1.purge([
                        (ctx.GenericIdentifier || []).map(i => i.image),
                        (ctx.ConcreteIdentifier || []).map(i => i.image),
                        (ctx.Identifier || []).map(i => i.image),
                        (ctx.GenericParameter || []).map(i => i.image)
                    ]);
                    return Object.assign({ type: NodeType.TYPE_FIELD }, this.GetIdentity(ctx), { ofType: items, annotations: helpers_1.purge((ctx.ANNOTATIONS || []).map(a => this.visit(a))) });
                }
                DATA(ctx) {
                    const options = ctx.DATA_OPTION.map(d => this.visit(d));
                    return Object.assign({ type: NodeType.DATA }, this.GetIdentity(ctx), { options });
                }
                DATA_OPTION(ctx) {
                    return Object.assign({ type: NodeType.DATA_OPTION }, this.GetIdentity(ctx));
                }
                ALIAS(ctx) {
                    return Object.assign({ type: NodeType.ALIAS }, this.GetIdentity(ctx), this.visit(ctx.ALIAS_FOR[0]));
                }
                ALIAS_FOR(ctx) {
                    const items = helpers_1.purge([
                        (ctx.GenericIdentifier || []).map(i => i.image),
                        (ctx.ConcreteIdentifier || []).map(i => i.image),
                        (ctx.Identifier || []).map(i => i.image),
                        (ctx.GenericParameter || []).map(i => i.image),
                        (ctx.StringLiteral || []).map(i => i.image),
                        (ctx.NumberLiteral || []).map(i => i.image),
                        (ctx.PatternLiteral || []).map(i => i.image)
                    ]);
                    return {
                        ofType: items
                    };
                }
                GetIdentity(ctx) {
                    if (ctx.GenericIdentifier) {
                        return {
                            id: ctx.GenericIdentifier[0].image,
                            params: ctx.GenericParameter.map(g => g.image),
                            id_start: helpers_1.getStartToken(ctx.GenericIdentifier[0]),
                            params_start: ctx.GenericParameter.map(helpers_1.getStartToken)
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
            };
            exports_5("OutlineVisitor", OutlineVisitor);
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
            })(NodeType || (NodeType = {}));
        }
    };
});
System.register("transpiler", ["commander"], function (exports_6, context_6) {
    "use strict";
    var program;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (program_1) {
                program = program_1;
            }
        ],
        execute: function () {
            program
                .version("0.0.1")
                .option("-a", "Output AST")
                .parse(process.argv);
            // export const transpile = (content: string, dir?: string) => {
            //   const tokenStream = DomainLexer.tokenize(content);
            //   parser.input = tokenStream.tokens;
            //   const cst = parser.START();
            //   const parserErrors = parser.errors.map(error => {
            //     console.log(JSON.stringify(error, null, 4));
            //     const bStart = getStartToken((error as any).previousToken);
            //     let eStart = getStartToken(error.token);
            //     eStart.startLineNumber = bStart.startLineNumber;
            //     eStart.startColumn = bStart.startColumn;
            //     let message;
            //     if (error.token.image === "=") {
            //       message = `Encountered a "=" symbol, maybe try a ":"`;
            //     } else if (error.token.image === "\n\n") {
            //       message = `Block not finished exception:\nEncountered a couple of new lines, this means that this block has ended and a new block is beginning. Looks like this was not intentional. `;
            //     }
            //     return {
            //       ...eStart,
            //       severity: 8,
            //       message: message || error.message || error.name
            //     };
            //   });
            //   const toOutlineVisitor = new OutlineVisitor();
            //   let result = toOutlineVisitor.visit(cst) || {};
            //   if (result.ast) {
            //     const errors = typeChecker(result.ast);
            //     result.errors = [...result.errors, ...errors, ...parserErrors];
            //     return result;
            //   } else {
            //     result.errors = parserErrors;
            //     return result;
            //   }
            // };
        }
    };
});
//# sourceMappingURL=car-lang.js.map