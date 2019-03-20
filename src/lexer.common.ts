import { createToken, Lexer } from "chevrotain";

export const EndBlock = createToken({
  name: "EndBlock",
  pattern: /\n(\s*\n)+(?!\s)/,
  push_mode: "root",
  group: Lexer.SKIPPED
});
