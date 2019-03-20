import { IData } from "../outline";
import { ILookup } from "./createERD";
export declare class PlantData {
    node: IData;
    lookup: ILookup;
    constructor(node: IData, lookup: ILookup);
    options(): string;
    associations(): string;
    annotations(): string;
    toString(): string;
}
