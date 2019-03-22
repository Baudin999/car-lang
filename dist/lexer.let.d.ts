import { TokenType } from "chevrotain";
export declare const KW_let: TokenType;
export declare const let_definition: TokenType[];
export declare const modTokens: (tokens: {
    [s: string]: TokenType;
}) => {
    [s: string]: TokenType;
};
export declare const Modify: ($: any, tokenLookup?: any) => void;
