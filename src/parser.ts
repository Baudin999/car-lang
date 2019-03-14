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
  CHOICE: any;
  CHOICE_OPTION: any;
  VIEW: any;
  RESTRICTION: any;
  ASSIGNMENT: any;
  PARAMETERS: any;
  STATEMENT: any;
  BINARY_EXPRESSION: any;
  VALUE_EXPRESSION: any;
  FUNCTION_APPLICATION: any;
  OPEN: any;
  IMPORTING: any;

  IDENTIFIER: any;
  TYPE_IDENTIFIER: any;

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
        { ALT: () => $.SUBRULE($.VIEW) },
        { ALT: () => $.SUBRULE($.CHOICE) },
        { ALT: () => $.SUBRULE($.OPEN) },
        { ALT: () => $.SUBRULE($.ASSIGNMENT) },
        { ALT: () => $.SUBRULE($.MARKDOWN_CHAPTER) },
        { ALT: () => $.SUBRULE($.MARKDOWN_PARAGRAPH) },
        { ALT: () => $.SUBRULE($.MARKDOWN_IMAGE) },
        { ALT: () => $.SUBRULE($.MARKDOWN_CODE) },
        { ALT: () => $.SUBRULE($.MARKDOWN_LIST) },
        { ALT: () => $.CONSUME(tokenLookup.CommentBlock) }
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
      $.CONSUME(tokenLookup.KW_Type);
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
      $.CONSUME(tokenLookup.Indent);

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
      $.CONSUME(tokenLookup.Identifier);
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
        $.AT_LEAST_ONE(() => $.CONSUME(tokenLookup.Indent));
        $.CONSUME(tokenLookup.DirectiveLiteral);
      });
      $.MANY1(() => {
        $.AT_LEAST_ONE1(() => $.CONSUME1(tokenLookup.Indent));
        $.CONSUME1(tokenLookup.Identifier);
      });
      $.CONSUME(tokenLookup.SIGN_close);
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
        GATE: this.isAnnotation as any,
        DEF: () => {
          $.CONSUME(tokenLookup.Indent);
          $.CONSUME(tokenLookup.AnnotationLiteral);
        }
      });
    });

    $.RULE("ROOT_ANNOTATIONS", () => {
      $.MANY(() => $.CONSUME(tokenLookup.AnnotationLiteral));
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

    /* WEAK ATTEMPT AT FUNCTIONS AND VARIABLES */
    $.RULE("ASSIGNMENT", () => {
      $.CONSUME(tokenLookup.KW_let);
      $.CONSUME(tokenLookup.ValiableIdentifier);
      $.SUBRULE($.PARAMETERS);
      $.CONSUME(tokenLookup.SIGN_Equals);
      $.SUBRULE($.STATEMENT);
    });

    $.RULE("PARAMETERS", () => {
      $.MANY(() => $.CONSUME(tokenLookup.ValiableIdentifier));
    });

    $.RULE("STATEMENT", () => {
      $.OR([
        { ALT: () => $.SUBRULE($.BINARY_EXPRESSION) },
        { ALT: () => $.SUBRULE($.VALUE_EXPRESSION) },
        { ALT: () => $.CONSUME(tokenLookup.ValiableIdentifier) }
      ]);
    });

    $.RULE("VALUE_EXPRESSION", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenLookup.NumberLiteral) },
        { ALT: () => $.CONSUME(tokenLookup.StringLiteral) },
        { ALT: () => $.CONSUME(tokenLookup.PatternLiteral) }
      ]);
    });

    $.RULE("BINARY_EXPRESSION", () => {
      $.CONSUME(tokenLookup.ValiableIdentifier);
      $.CONSUME(tokenLookup.Operator);
      $.SUBRULE($.STATEMENT);
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
