import {
    IExpression,
    NodeType,
    IFlow,
    IFlowFunction,
    IPubSub,
    IOperation,
    IFireAndForget
} from "../outline";
import { purge, foldText } from "../helpers";
import { createFunction } from "./function";
import { createPub } from "./pub";
import { createSub } from "./sub";
import { createOperation } from "./operation";
import { createFireAndForget } from "./fireAndForget";

export const createFlow = (flow: IFlow): IFlowResult => {
    // here we'll export a flow diagram for PlantUML
    // this will be a difficult execise because it will
    // be a rather messy mapping...

    let definitions = [];
    let state: string[] = [];
    let operations: string[] = [];
    let _results: string[] = [];

    flow.operations.forEach((operation, index) => {
        if (operation.type === NodeType.FLOW_FUNCTION) {
            let { template } = createFunction(operation as IFlowFunction);
            state.push(template);
        } else if (operation.type === NodeType.PUB) {
            let { template } = createPub(operation as IPubSub, index);
            operations.push(template);
        } else if (operation.type === NodeType.SUB) {
            let { template } = createSub(operation as IPubSub, index);
            operations.push(template);
        } else if (operation.type === NodeType.OPERATION) {
            let { template, results } = createOperation(operation as IOperation, index);
            operations.push(template);
            _results.unshift(results);
        } else if (operation.type === NodeType.FIRE_FORGET) {
            let { template } = createFireAndForget(operation as IFireAndForget, index);
            _results.forEach(r => operations.push(r));
            operations.push(template);
            _results = [];
        }
    });

    let result: IFlowResult = {};

    if (operations.length > 0) {
        result.sequence = `
@startuml
${operations.join("\n")}
${_results.join("\n")}
@enduml
        `.trim();
    }

    if (state.length > 0) {
        result.state = `
@startuml
${state.join("\n")}
@enduml
        `.trim();
    }

    return result;
};

export interface IFlowResult {
    state?: string;
    sequence?: string;
    useCase?: string;
}
