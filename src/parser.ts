import { Parser, IToken } from "chevrotain";
import { tokenLookup } from "./lexer";
import { purge } from "./helpers";

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
  GUIDELINE: any;
  FLOW: any;
  FLOW_FUNCTION: any;
  FLOW_SYSTEM: any;
  FLOW_SUB: any;
  FLOW_PUB: any;
  OPERATION: any;
  OPERATION_RESULT: any;
  OPERATION_PARAMETER: any;
  OPERATION_PARAMETER_TYPE: any;
  OPERATION_PARAMETER_FIELD_TYPE: any;
  MAP: any;
  MAP_FLOW: any;
  MAP_FLOW_KEY: any;

  COMMENT: any;
  IDENTIFIER: any;
  TYPE_IDENTIFIER: any;
  ID_OR_STRING: any;

  //ROOT_ANNOTATIONS: any;
  ANNOTATIONS: any;
  ANNOTATION: any;
  CHOICE_ANNOTATION: any;

  MARKDOWN_CHAPTER: any;
  MARKDOWN_PARAGRAPH: any;
  MARKDOWN_IMAGE: any;
  MARKDOWN_CODE: any;
  MARKDOWN_LIST: any;

  MARKDOWN: any;

  constructor() {
    super(tokenLookup);

    const $ = this;

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
        { ALT: () => $.SUBRULE($.GUIDELINE) },
        { ALT: () => $.SUBRULE($.MAP) },
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

      $.OPTION1(() => {
        $.CONSUME(tokenLookup.KW_extends);
        $.AT_LEAST_ONE1(() => $.CONSUME1(tokenLookup.Identifier));
      });

      $.OPTION2(() => {
        $.CONSUME(tokenLookup.SIGN_EqualsType);
        $.AT_LEAST_ONE2({
          DEF: () =>
            $.OR([{ ALT: () => $.SUBRULE($.COMMENT) }, { ALT: () => $.SUBRULE($.TYPE_FIELD) }])
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

      $.MANY2(() => $.SUBRULE($.OPERATION));

      $.CONSUME(tokenLookup.SIGN_close);
    });

    $.RULE("GUIDELINE", () => {
      $.CONSUME(tokenLookup.KW_guideline);
      $.CONSUME(tokenLookup.SIGN_open);
      $.MANY(() => {
        $.CONSUME(tokenLookup.DirectiveLiteral);
      });
      $.MANY1(() => {
        $.SUBRULE($.MARKDOWN);
      });
      $.CONSUME(tokenLookup.SIGN_close);
    });

    $.RULE("COMMENT", () => {
      $.OPTION(() => $.CONSUME(tokenLookup.Indent));
      $.CONSUME(tokenLookup.CommentBlock);
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
      $.CONSUME(tokenLookup.KW_flow);
      $.CONSUME(tokenLookup.SIGN_open);
      $.MANY(() => $.CONSUME(tokenLookup.DirectiveLiteral));
      $.MANY1(() => $.SUBRULE($.OPERATION));
      $.CONSUME(tokenLookup.SIGN_close);
    });

    $.RULE("OPERATION", () => {
      $.MANY(() => {
        $.OPTION(() => $.CONSUME(tokenLookup.Indent));
        $.CONSUME(tokenLookup.AnnotationLiteral);
      });
      $.AT_LEAST_ONE(() => $.CONSUME1(tokenLookup.Indent));
      $.OR([
        { GATE: $.isSub, ALT: () => $.SUBRULE($.FLOW_SUB) },
        { GATE: $.isPub, ALT: () => $.SUBRULE($.FLOW_PUB) },
        { ALT: () => $.SUBRULE($.FLOW_SYSTEM) },
        { ALT: () => $.SUBRULE($.FLOW_FUNCTION) }
      ]);
    });

    $.RULE("FLOW_FUNCTION", () => {
      // length :: String -> Number

      $.CONSUME(tokenLookup.GenericParameter);
      $.CONSUME(tokenLookup.SIGN_TypeDefStart);
      $.CONSUME1(tokenLookup.SIGN_TypeDefStart);

      // the parameters
      $.AT_LEAST_ONE_SEP({
        SEP: tokenLookup.SIGN_arrow,
        DEF: () => $.SUBRULE($.OPERATION_PARAMETER)
      });
    });

    $.RULE("FLOW_SUB", () => {
      // "CustomerService" sub "Customer Requested" :: String

      // "CustomerService" sub "Customer Requested"
      $.SUBRULE($.ID_OR_STRING);
      $.CONSUME(tokenLookup.KW_sub);
      $.SUBRULE1($.ID_OR_STRING);

      // ::
      $.CONSUME(tokenLookup.SIGN_TypeDefStart);
      $.CONSUME2(tokenLookup.SIGN_TypeDefStart);

      // params
      $.AT_LEAST_ONE_SEP({
        SEP: tokenLookup.SIGN_arrow,
        DEF: () => $.SUBRULE($.OPERATION_PARAMETER)
      });
    });

    $.RULE("FLOW_PUB", () => {
      // "CustomerService" pub to CustomerReceived :: Customer
      $.SUBRULE($.ID_OR_STRING);
      $.CONSUME(tokenLookup.KW_pub);
      $.SUBRULE1($.ID_OR_STRING);

      // ::
      $.CONSUME(tokenLookup.SIGN_TypeDefStart);
      $.CONSUME2(tokenLookup.SIGN_TypeDefStart);

      // params
      $.AT_LEAST_ONE_SEP({
        SEP: tokenLookup.SIGN_arrow,
        DEF: () => $.SUBRULE($.OPERATION_PARAMETER)
      });
    });

    $.RULE("FLOW_SYSTEM", () => {
      // Consume the system definition
      // ("Entity Service", SAP) ::
      $.CONSUME(tokenLookup.SIGN_wrapOpen);
      $.SUBRULE($.ID_OR_STRING);
      $.CONSUME(tokenLookup.SIGN_collectionSeparator);
      $.SUBRULE2($.ID_OR_STRING);
      $.CONSUME(tokenLookup.SIGN_wrapClose);
      $.OPTION(() => $.CONSUME(tokenLookup.SIGN_fireAndForget));
      $.CONSUME(tokenLookup.SIGN_TypeDefStart);
      $.CONSUME2(tokenLookup.SIGN_TypeDefStart);

      // Now for the system part which is exactly the same as
      // the function description in the FLOW_FUNCTION
      $.AT_LEAST_ONE_SEP({
        SEP: tokenLookup.SIGN_arrow,
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
      $.CONSUME(tokenLookup.SIGN_wrapOpen);
      $.CONSUME(tokenLookup.GenericParameter);
      $.CONSUME(tokenLookup.SIGN_TypeDefStart);
      $.SUBRULE($.TYPE_IDENTIFIER);
      $.CONSUME(tokenLookup.SIGN_wrapClose);
    });

    $.RULE("OPERATION_PARAMETER_TYPE", () => {
      $.SUBRULE($.TYPE_IDENTIFIER);
    });

    $.RULE("ID_OR_STRING", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenLookup.GenericIdentifier) },
        { ALT: () => $.CONSUME(tokenLookup.Identifier) },
        { ALT: () => $.CONSUME(tokenLookup.StringLiteral) }
      ]);
    });

    $.RULE("RESTRICTION", () => {
      $.MANY(() => {
        $.CONSUME(tokenLookup.Indent);
        $.CONSUME(tokenLookup.AnnotationLiteral);
      });
      $.AT_LEAST_ONE(() => {
        $.CONSUME1(tokenLookup.Indent);
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

    $.RULE("MAP", () => {
      $.CONSUME(tokenLookup.KW_map);
      $.CONSUME(tokenLookup.SIGN_open);
      $.MANY(() => $.SUBRULE($.MAP_FLOW));
      $.CONSUME(tokenLookup.SIGN_close);
    });

    $.RULE("MAP_FLOW", () => {
      $.OPTION(() => $.CONSUME(tokenLookup.Indent));
      $.AT_LEAST_ONE_SEP({
        SEP: tokenLookup.SIGN_arrow,
        DEF: () => {
          $.SUBRULE($.MAP_FLOW_KEY);
        }
      });
    });

    $.RULE("MAP_FLOW_KEY", () => {
      $.OR([
        { ALT: () => $.CONSUME(tokenLookup.Identifier) },
        { ALT: () => $.CONSUME(tokenLookup.StringLiteral) }
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
            $.CONSUME1(tokenLookup.Identifier);
            $.CONSUME(tokenLookup.SIGN_dot);
            $.AT_LEAST_ONE_SEP({
              SEP: tokenLookup.SIGN_dot,
              DEF: () => {
                $.CONSUME2(tokenLookup.Identifier);
              }
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
        DEF: () => {
          $.OPTION(() => $.CONSUME(tokenLookup.Indent));
          $.CONSUME(tokenLookup.AnnotationLiteral);
        }
      });
    });

    $.RULE("CHOICE_ANNOTATION", () => {
      $.MANY(() => {
        $.CONSUME(tokenLookup.AnnotationLiteral);
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

    /*
    alias Name = String
        | min 12  <-- The first token should always be at least one 
                      Indent and then a restriction token
        @ We could also have annotations
        | max 30  <-- but we could also have an annotation first

    The annotation first has not been implemented yet.
    */

    return isOr(t2) || isOr(t3);
  }

  isGenericParameter(): boolean | undefined {
    let t1 = this.LA(1) as IToken;
    let keywords = ["extends", "type", "alias", "data", "aggregate", "view", "map"];
    return keywords.indexOf(t1.image) === -1;
  }

  isSub() {
    let t2 = this.LA(2) as IToken;
    return t2.image === "sub";
  }
  isPub() {
    let t2 = this.LA(2) as IToken;
    return t2.image === "pub";
  }
}

export const parser = new DomainParser();
