import { IFlow } from "../outline";
export declare const createFlow: (flow: IFlow) => IFlowResult;
export interface IFlowResult {
    state?: string;
    sequence?: string;
    useCase?: string;
}
