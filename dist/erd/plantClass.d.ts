import { IType } from "../outline";
import { ILookup } from "./createERD";
export declare class PlantClass {
    node: IType;
    lookup: ILookup;
    constructor(node: IType, lookup: ILookup);
    fields(): string;
    associations(): string;
    extensions(): string;
    annotations(): string[];
    source(): string;
    toString(): string;
}
