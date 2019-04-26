"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
const function_1 = require("./function");
const pub_1 = require("./pub");
const sub_1 = require("./sub");
const operation_1 = require("./operation");
const fireAndForget_1 = require("./fireAndForget");
exports.createFlow = (flow) => {
    // here we'll export a flow diagram for PlantUML
    // this will be a difficult execise because it will
    // be a rather messy mapping...
    let definitions = [];
    let state = [];
    let operations = [];
    let _results = [];
    flow.operations.forEach((operation, index) => {
        if (operation.type === outline_1.NodeType.FLOW_FUNCTION) {
            let { template } = function_1.createFunction(operation);
            state.push(template);
        }
        else if (operation.type === outline_1.NodeType.PUB) {
            let { template } = pub_1.createPub(operation, index);
            operations.push(template);
        }
        else if (operation.type === outline_1.NodeType.SUB) {
            let { template } = sub_1.createSub(operation, index);
            operations.push(template);
        }
        else if (operation.type === outline_1.NodeType.OPERATION) {
            let { template, results } = operation_1.createOperation(operation, index);
            operations.push(template);
            _results.unshift(results);
        }
        else if (operation.type === outline_1.NodeType.FIRE_FORGET) {
            let { template } = fireAndForget_1.createFireAndForget(operation, index);
            _results.forEach(r => operations.push(r));
            operations.push(template);
            _results = [];
        }
    });
    let result = {};
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
//# sourceMappingURL=createFlow.js.map