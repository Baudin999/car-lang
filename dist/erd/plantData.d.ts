import { IData } from "../outline";
import { ILookup } from "./createERD";
export declare class PlantData {
    node: IData;
    lookup: ILookup;
    lookupValues: string[];
    constructor(node: IData, lookup: ILookup);
    options(): string;
    associations(): string;
    annotations(): string;
    paramAssociations(): string;
    params(): string;
    toString(): string;
}
