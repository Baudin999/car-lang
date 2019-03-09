import { Parser, IToken } from "chevrotain";
import { tokenLookup } from "./lexer";

class DomainParser extends Parser {
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

  constructor() {
    super(tokenLookup, {
      // passing our custom error message provider
      //errorMessageProvider: carErrorProvider
    } as any);

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
        { ALT: () => $.CONSUME(tokenLookup.CommentBlock) }
      ]);
    });

    $.RULE("TYPE", () => {
      $.CONSUME(tokenLookup.KW_Type);
      $.OR([
        { ALT: () => $.CONSUME(tokenLookup.Identifier) },
        {
          ALT: () => {
            $.CONSUME(tokenLookup.GenericIdentifier);
            $.MANY(() => {
              $.CONSUME1(tokenLookup.GenericParameter);
            });
          }
        }
      ]);
      $.MANY1(() => $.CONSUME(tokenLookup.GenericParameter));

      $.OPTION2(() => {
        $.CONSUME(tokenLookup.SIGN_EqualsType);
        $.AT_LEAST_ONE({
          DEF: () => $.SUBRULE($.TYPE_FIELD)
        });
      });
    });

    $.RULE("TYPE_FIELD", () => {
      $.SUBRULE($.ANNOTATIONS);
      $.CONSUME(tokenLookup.Indent);
      $.CONSUME(tokenLookup.FieldName);
      $.CONSUME(tokenLookup.SIGN_TypeDefStart);

      $.OR([
        { ALT: () => $.CONSUME(tokenLookup.GenericParameter) },
        {
          ALT: () => {
            $.CONSUME(tokenLookup.GenericIdentifier);
            $.MANY(() => {
              $.CONSUME1(tokenLookup.GenericParameter);
            });
          }
        },
        {
          ALT: () => {
            $.AT_LEAST_ONE(() => {
              $.OR1([
                { ALT: () => $.CONSUME(tokenLookup.Identifier) },
                { ALT: () => $.CONSUME(tokenLookup.ConcreteIdentifier) },
                { ALT: () => $.CONSUME(tokenLookup.StringLiteral) },
                { ALT: () => $.CONSUME(tokenLookup.NumberLiteral) },
                { ALT: () => $.CONSUME(tokenLookup.PatternLiteral) }
              ]);
            });
          }
        }
      ]);
    });

    $.RULE("ALIAS", () => {
      $.CONSUME(tokenLookup.KW_Alias);
      $.CONSUME(tokenLookup.Identifier);
      $.CONSUME(tokenLookup.SIGN_EqualsAlias);
      $.SUBRULE($.ALIAS_FOR);
    });

    $.RULE("ALIAS_FOR", () => {
      $.AT_LEAST_ONE(() => {
        $.OR([
          { ALT: () => $.CONSUME(tokenLookup.Identifier) },
          { ALT: () => $.CONSUME(tokenLookup.ConcreteIdentifier) },
          { ALT: () => $.CONSUME(tokenLookup.StringLiteral) },
          { ALT: () => $.CONSUME(tokenLookup.NumberLiteral) },
          { ALT: () => $.CONSUME(tokenLookup.PatternLiteral) }
        ]);
      });
    });

    $.RULE("DATA", () => {
      $.CONSUME(tokenLookup.KW_data);
      $.OR([
        { ALT: () => $.CONSUME(tokenLookup.Identifier) },
        { ALT: () => $.CONSUME(tokenLookup.GenericIdentifier) }
      ]);

      $.MANY(() => $.CONSUME(tokenLookup.GenericParameter));
      $.CONSUME(tokenLookup.SIGN_EqualsData);
      $.AT_LEAST_ONE(() => $.SUBRULE($.DATA_OPTION));
    });

    $.RULE("DATA_OPTION", () => {
      $.SUBRULE($.ANNOTATIONS);
      $.CONSUME(tokenLookup.Indent);
      $.CONSUME(tokenLookup.SIGN_Or);
      $.OR([
        { ALT: () => $.CONSUME(tokenLookup.Identifier) },
        {
          ALT: () => {
            $.CONSUME(tokenLookup.GenericIdentifier);
            $.MANY(() => {
              $.CONSUME1(tokenLookup.GenericParameter);
            });
          }
        },
        {
          ALT: () => {
            $.CONSUME(tokenLookup.ConcreteIdentifier);
            $.MANY1(() => {
              $.CONSUME1(tokenLookup.Identifier);
            });
          }
        }
      ]);
    });

    $.RULE("ANNOTATIONS", () => {
      $.MANY({
        GATE: this.isAnnotation as any,
        DEF: () => {
          $.CONSUME(tokenLookup.Indent);
          $.CONSUME(tokenLookup.Annotation);
        }
      });
    });

    $.RULE("ROOT_ANNOTATIONS", () => {
      $.MANY(() => $.CONSUME(tokenLookup.Annotation));
    });

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
      return t2 && t2.tokenType && t2.tokenType.tokenName === "Annotation";
    }
    return t1 && t1.tokenType && t1.tokenType.tokenName === "Annotation";
  }
}

export const parser = new DomainParser();
