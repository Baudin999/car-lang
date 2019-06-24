import { IAlias } from "../../outline";
export declare class XsdAlias {
    private node;
    private $type;
    constructor(node: IAlias);
    mapRestrictions: () => string;
    toString(): string;
}
