import { createToken, Lexer, ITokenConfig, TokenType } from "chevrotain";
import { NumberLiteral, StringLiteral } from "./lexer.literals";
import { EndBlock } from "./lexer.common";

/* THE LET TOKENS */
export const KW_let = createToken({
  name: "KW_let",
  pattern: /let/,
  push_mode: "let_definition"
});

const let_equals = createToken({
  name: "let_equals",
  pattern: /=/
});

const let_parameter = createToken({
  name: "let_parameter",
  pattern: /[a-z][a-zA-Z0-9_]*/
});

const let_identifier = createToken({
  name: "let_identifier",
  pattern: /[a-z][a-zA-Z0-9_]*(?= *(=|[a-z]))/
});

export const let_definition = [EndBlock, let_equals, let_identifier, NumberLiteral, StringLiteral];

export const modTokens = (tokens: { [s: string]: TokenType }) => {
  tokens["KW_let"] = KW_let;
  tokens["let_equals"] = let_equals;
  tokens["let_identifier"] = let_identifier;
  tokens["let_parameter"] = let_parameter;
  return tokens;
};

export const Modify = ($: any, tokenLookup: any = {}) => {
  $.RULE("LET", function() {
    $.CONSUME(KW_let);
    $.CONSUME(let_identifier);
    $.MANY(() => $.CONSUME(let_parameter));
    $.CONSUME(let_equals);
    //$.CONSUME(NumberLiteral);

    console.log($.tokVector);
    console.log($.CONSUME);
    $.OR([
      {
        ALT: () => {
          $.CONSUME(StringLiteral);
        }
      },
      {
        ALT: () => {
          $.CONSUME(NumberLiteral);
        }
      }
    ]);
  });
};
