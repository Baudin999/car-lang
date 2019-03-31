import { IType } from "../outline";
export declare class XsdClass {
    private node;
    constructor(node: IType);
    complexType(): string;
    simpleTypes(): string;
    toString(): string;
}
